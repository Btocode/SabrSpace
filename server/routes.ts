import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { users, questionSets, questions } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { authenticateToken, optionalAuthenticateToken, authStorage } from "./auth";
import { attachClientIP } from "./auth/middleware";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // IP middleware for anonymous session tracking
  app.use(attachClientIP);

  // Auth Routes
  const { authRoutes } = await import("./auth/routes");
  app.use(authRoutes);

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

  app.post(api.public.submitResponse.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const token = req.params.token;
      const userId = (req as any).user?.id;
      const input = req.body; // TODO: Add proper validation
      const response = await storage.submitResponse(token, input, userId);
      res.status(201).json(response);
    } catch (err) {
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
    return req.user?.id;
  };

  app.get(api.sets.list.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    const sets = await storage.listQuestionSets(userId);
    res.json(sets);
  });

  app.post(api.sets.create.path, authenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      const input = req.body; // TODO: Add proper validation
      const set = await storage.createQuestionSet(userId, input);
      res.status(201).json(set);
    } catch (err) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.sets.get.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    const set = await storage.getQuestionSet(Number(req.params.id));
    if (!set || set.userId !== userId) {
      return res.status(404).json({ message: "Set not found" });
    }
    res.json(set);
  });

  app.patch(api.sets.update.path, authenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      const input = req.body; // TODO: Add proper validation
      const set = await storage.updateQuestionSet(Number(req.params.id), userId, input);
      if (!set) return res.status(404).json({ message: "Set not found" });
      res.json(set);
    } catch (err) {
       res.status(500).json({ message: "Error" });
    }
  });

  app.delete(api.sets.delete.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    await storage.deleteQuestionSet(Number(req.params.id), userId);
    res.status(204).send();
  });

  app.post(api.sets.regenerateToken.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    try {
      const token = await storage.regenerateToken(Number(req.params.id), userId);
      res.json({ token });
    } catch (e) {
      res.status(403).json({ message: "Unauthorized" });
    }
  });

  app.get(api.responses.list.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    const responses = await storage.getResponses(Number(req.params.setId), userId);
    res.json(responses);
  });

  app.get(api.dashboard.stats.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    const stats = await storage.getStats(userId);
    res.json(stats);
  });

  app.get(api.notifications.list.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    const notifs = await storage.getNotifications(userId);
    res.json(notifs);
  });

  app.patch(api.notifications.markRead.path, authenticateToken, async (req, res) => {
    const userId = getUserId(req);
    await storage.markNotificationsRead(userId);
    res.json({ success: true });
  });

  // Seed data logic
  async function seed() {
    // Check if we have any sets
    const existing = await db.select().from(questionSets).limit(1);
    if (existing.length > 0) return;

    // Create a demo user if none exists (Wait, we rely on Replit Auth which creates users on login. 
    // We can't easily seed a user without a real ID. 
    // But we can create a "System" user for demo purposes if we really want to showing "Demo" sets).
    // Actually, let's just log that seeding requires a logged in user.
    // Or we can create a dummy user with a fixed ID for demo purposes.
    const demoUserId = "demo-user-id";

    // Check if demo user exists
    const user = await authStorage.getUser(demoUserId);
    if (!user) {
      await authStorage.upsertUser({
        id: demoUserId,
        email: "demo@sabrspace.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: null,
        password: null // Anonymous user
      });
    }

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
        { prompt: "What are your life goals?", type: "TEXT", required: true, order: 0 },
        { prompt: "How do you handle conflict?", type: "TEXT", required: true, order: 1 },
        { prompt: "What is your prayer routine?", type: "CHOICE", required: true, order: 2, options: ["5 times daily", "Sometimes", "Trying to improve"] },
        { prompt: "Do you smoke?", type: "CHOICE", required: true, order: 3, options: ["Yes", "No"] }
      ]
    });
    
    console.log("Database seeded with demo content");
  }
  
  // Run seed
  seed().catch(console.error);

  return httpServer;
}
