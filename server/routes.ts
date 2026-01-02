import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import {
  setupAuth,
  registerAuthRoutes,
  isAuthenticated,
} from "./replit_integrations/auth";
import { users, questionSets, questions } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
// import { authStorage } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup - Temporarily disabled for development
  // await setupAuth(app);
  // registerAuthRoutes(app);

  // === Public Routes ===

  app.get(api.public.getSet.path, async (req, res) => {
    const token = req.params.token;
    const set = await storage.getQuestionSetByToken(token);
    if (!set) {
      return res.status(404).json({ message: "Set not found" });
    }
    // Increment views
    await storage.incrementViews(set.id);
    res.json(set);
  });

  app.post(api.public.submitResponse.path, async (req, res) => {
    try {
      const token = req.params.token;
      const input = req.body as any; // TODO: Add proper validation
      const response = await storage.submitResponse(token, input);
      res.status(201).json(response);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === Protected Routes ===
  // Helper to get numeric user ID from auth (Replit auth uses string sub, we map to int user.id if needed,
  // but wait, schema defines User.id as Serial (int).
  // Integration Auth defines User.id as string (UUID).
  // This is a mismatch I introduced.
  // Integration blueprint uses shared/models/auth.ts which has id: varchar("id").primaryKey().default(sql`gen_random_uuid()`).
  // My shared/schema.ts has id: serial("id").
  // Since I imported * from models/auth, the 'users' table from models/auth might be shadowed or conflict if I redefined it.
  // In shared/schema.ts I redefined 'users'. This is bad.
  // I need to use the 'users' from models/auth or reconcile them.
  // The integration expects string IDs.
  // My schema expects integer IDs for foreign keys (userId: integer).
  // I should update my schema to use varchar for userId to match the Auth system.

  // For now, let's assume I will fix the schema in the next step to use varchar for user IDs.
  // Let's implement routes assuming userId is string.

  const getUserId = (req: any): string => {
    // Temporary: return a dummy user ID for development without auth
    return "demo-user-id";
  };

  app.get(
    api.sets.list.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      const sets = await storage.listQuestionSets(userId);
      res.json(sets);
    }
  );

  app.post(
    api.sets.create.path,
    /* isAuthenticated, */ async (req, res) => {
      try {
        const userId = getUserId(req);
        const input = req.body as any; // TODO: Add proper validation
        const set = await storage.createQuestionSet(userId, input);
        res.status(201).json(set);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal Error" });
      }
    }
  );

  app.get(
    api.sets.get.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      const set = await storage.getQuestionSet(Number(req.params.id));
      if (!set || set.userId !== userId) {
        return res.status(404).json({ message: "Set not found" });
      }
      res.json(set);
    }
  );

  app.patch(
    api.sets.update.path,
    /* isAuthenticated, */ async (req, res) => {
      try {
        const userId = getUserId(req);
        const input = req.body as any; // TODO: Add proper validation
        const set = await storage.updateQuestionSet(
          Number(req.params.id),
          userId,
          input
        );
        if (!set) return res.status(404).json({ message: "Set not found" });
        res.json(set);
      } catch (err) {
        res.status(500).json({ message: "Error" });
      }
    }
  );

  app.delete(
    api.sets.delete.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      await storage.deleteQuestionSet(Number(req.params.id), userId);
      res.status(204).send();
    }
  );

  app.post(
    api.sets.regenerateToken.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      try {
        const token = await storage.regenerateToken(
          Number(req.params.id),
          userId
        );
        res.json({ token });
      } catch (e) {
        res.status(403).json({ message: "Unauthorized" });
      }
    }
  );

  app.get(
    api.responses.list.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      const responses = await storage.getResponses(
        Number(req.params.setId),
        userId
      );
      res.json(responses);
    }
  );

  app.get(
    api.dashboard.stats.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      const stats = await storage.getStats(userId);
      res.json(stats);
    }
  );

  app.get(
    api.notifications.list.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      const notifs = await storage.getNotifications(userId);
      res.json(notifs);
    }
  );

  app.patch(
    api.notifications.markRead.path,
    /* isAuthenticated, */ async (req, res) => {
      const userId = getUserId(req);
      await storage.markNotificationsRead(userId);
      res.json({ success: true });
    }
  );

  // Seed data logic
  async function seed() {
    try {
      // Check if we have any sets
      const existing = await db.select().from(questionSets).limit(1);
      if (existing.length > 0) return;

      // Use demo user ID (auth is disabled)
      const demoUserId = "demo-user-id";

      // Create Matrimony Starter Pack
      await storage.createQuestionSet(demoUserId, {
        title: "Matrimony Starter Pack",
        description: "A respectful set of questions for potential spouses.",
        defaultLocale: "en",
        isOpen: true,
        requireAttestation: true,
        allowAnonymous: false,
        allowMultipleSubmissions: false,
        questions: [
          {
            prompt: "What are your life goals?",
            type: "TEXT",
            required: true,
            order: 0,
          },
          {
            prompt: "How do you handle conflict?",
            type: "TEXT",
            required: true,
            order: 1,
          },
          {
            prompt: "What is your prayer routine?",
            type: "CHOICE",
            required: true,
            order: 2,
            options: ["5 times daily", "Sometimes", "Trying to improve"],
          },
          {
            prompt: "Do you smoke?",
            type: "CHOICE",
            required: true,
            order: 3,
            options: ["Yes", "No"],
          },
        ],
      });

      console.log("Database seeded with demo content");
    } catch (error) {
      console.error("Seeding failed:", error);
    }
  }

  // Run seed
  seed().catch(console.error);

  return httpServer;
}
