import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import {
  users,
  questionSets,
  questions,
  createBiodataSchema,
  updateBiodataSchema,
  biodataWizardBasicProfileSchema,
  biodataWizardAddressSchema,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { authenticateToken, optionalAuthenticateToken, authStorage } from "./auth";
import { attachClientIP } from "./auth/middleware";
import { buildBiodataPdf } from "./biodataPdf";

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

  // === Biodata Routes ===

  app.post(api.biodataWizard.createFromBasicProfile.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const step = biodataWizardBasicProfileSchema.parse(req.body);
      const gender = step.biodata_type === "groom" ? "male" : "female";
      const maritalStatus =
        step.marital_status === "unmarried"
          ? "never_married"
          : step.marital_status === "married"
            ? "married"
            : step.marital_status;

      const payload = createBiodataSchema.parse({
        fullName: step.fullName,
        gender,
        dateOfBirth: step.birth_month_year,
        maritalStatus,
        height: step.height,
        weight: step.weight,
        complexion: step.complexion,
        bloodGroup: step.blood_group,
        nationality: step.nationality,
      });

      const created = await storage.createBiodata(userId, payload);
      return res.status(201).json(created);
    } catch (err: any) {
      if (err?.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      console.error("Biodata wizard create error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.biodataWizard.updateStep.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const biodataId = Number(req.params.id);
      const stepId = String(req.params.stepId);

      let updatePayload: any = {};

      if (stepId === "basic_profile") {
        const step = biodataWizardBasicProfileSchema.parse(req.body);
        const gender = step.biodata_type === "groom" ? "male" : "female";
        const maritalStatus =
          step.marital_status === "unmarried"
            ? "never_married"
            : step.marital_status === "married"
              ? "married"
              : step.marital_status;

        updatePayload = {
          fullName: step.fullName,
          gender,
          dateOfBirth: step.birth_month_year,
          maritalStatus,
          height: step.height,
          weight: step.weight,
          complexion: step.complexion,
          bloodGroup: step.blood_group,
          nationality: step.nationality,
        };
      } else if (stepId === "address") {
        const step = biodataWizardAddressSchema.parse(req.body);
        updatePayload = {
          address: `${step.permanent_address.area_name || ""}, ${step.permanent_address.district}, ${step.permanent_address.division}, ${step.permanent_address.country}`.replace(
            /^, /,
            "",
          ),
          city: step.permanent_address.district,
          state: step.permanent_address.division,
          country: step.permanent_address.country,
        };
      } else {
        return res.status(400).json({ message: "Validation error", errors: [{ path: ["stepId"], message: "Unsupported step" }] });
      }

      const validated = updateBiodataSchema.parse(updatePayload);
      const updated = await storage.updateBiodata(biodataId, userId, validated);
      if (!updated) {
        return res.status(404).json({ message: "Biodata not found or unauthorized" });
      }
      return res.json(updated);
    } catch (err: any) {
      if (err?.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      console.error("Biodata wizard updateStep error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public biodata routes
  app.get(api.publicBiodata.get.path, async (req, res) => {
    const biodataEntry = await storage.getBiodataByToken(req.params.token);
    if (!biodataEntry || biodataEntry.status !== 'published') {
      return res.status(404).json({ message: "Biodata not found" });
    }
    res.json(biodataEntry);
  });

  // Protected biodata routes (allow anonymous users)
  app.get(api.biodata.list.path, optionalAuthenticateToken, async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const biodataList = await storage.listBiodata(userId);
    res.json(biodataList);
  });

  app.post(api.biodata.create.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      console.log('User ID from request:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID truthy check:', !!userId);

      if (!userId) {
        console.log('No userId found, returning 401');
        return res.status(401).json({ message: "Authentication required" });
      }

      // Validate input using the schema
      const input = req.body;
      console.log('Biodata creation input:', JSON.stringify(input, null, 2));

      let validatedInput;
      try {
        validatedInput = createBiodataSchema.parse(input);
        console.log('Schema validation successful');
        console.log('Calling storage.createBiodata with userId:', userId);
        const newBiodata = await storage.createBiodata(userId, validatedInput);
        console.log('Biodata created successfully:', newBiodata);
        res.status(201).json(newBiodata);
      } catch (validationErr: any) {
        console.error('Validation error:', validationErr.errors);
        return res.status(400).json({ message: "Validation error", errors: validationErr.errors });
      }
    } catch (err: any) {
      console.error('Biodata creation error:', err);
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
      if (err.name === 'ZodError') {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Internal server error", details: err.message });
    }
  });

  app.get(api.biodata.get.path, optionalAuthenticateToken, async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const biodataEntry = await storage.getBiodata(Number(req.params.id));
    if (!biodataEntry || biodataEntry.userId !== userId) {
      return res.status(404).json({ message: "Biodata not found" });
    }
    res.json(biodataEntry);
  });

  app.patch(api.biodata.update.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      let input: any;
      try {
        input = updateBiodataSchema.parse(req.body);
      } catch (validationErr: any) {
        return res.status(400).json({ message: "Validation error", errors: validationErr.errors });
      }
      const biodataId = Number(req.params.id);
      
      // Update with only the fields provided in the request
      const updatedBiodata = await storage.updateBiodata(biodataId, userId, input);
      
      if (!updatedBiodata) {
        return res.status(404).json({ message: "Biodata not found or unauthorized" });
      }
      
      res.json(updatedBiodata);
    } catch (err) {
      console.error('Biodata update error:', err);
      const message = err instanceof Error ? err.message : "Internal server error";
      if (typeof message === "string" && message.startsWith("Invalid ")) {
        const field = message.replace(/^Invalid\s+/, "");
        return res
          .status(400)
          .json({ message: "Validation error", errors: [{ path: [field], message }] });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.biodata.delete.path, optionalAuthenticateToken, async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    await storage.deleteBiodata(Number(req.params.id), userId);
    res.status(204).send();
  });

  app.post(api.biodata.publish.path, authenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      const publishedBiodata = await storage.publishBiodata(Number(req.params.id), userId);
      if (!publishedBiodata) return res.status(404).json({ message: "Biodata not found" });
      res.json(publishedBiodata);
    } catch (err: any) {
      if (err.message === 'Authentication required for publishing biodata') {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.biodata.download.path, optionalAuthenticateToken, async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const id = Number(req.params.id);
      const biodataEntry = await storage.getBiodata(id);
      if (!biodataEntry || biodataEntry.userId !== userId) {
        return res.status(404).json({ message: "Biodata not found" });
      }

      if (biodataEntry.status === "draft") {
        return res.status(400).json({ message: "Biodata is not completed yet" });
      }

      const variantRaw = typeof req.query.variant === "string" ? req.query.variant : "comprehensive";
      const variant = variantRaw === "minimal" ? "minimal" : "comprehensive";

      const pdfBytes = await buildBiodataPdf(
        {
          ...(biodataEntry as any),
          id: biodataEntry.id,
        },
        variant,
      );

      const safeName = (biodataEntry.fullName || "biodata").replace(/[^a-z0-9\- _]/gi, "").trim() || "biodata";
      const filename = `${safeName}-${variant}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
      return res.status(200).send(Buffer.from(pdfBytes));
    } catch (err) {
      console.error("Biodata download error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes for biodata review
  app.get(api.biodataAdmin.pending.path, authenticateToken, async (req, res) => {
    // TODO: Add admin role check
    const pendingBiodata = await storage.getPendingBiodata();
    res.json(pendingBiodata);
  });

  app.post(api.biodataAdmin.review.path, authenticateToken, async (req, res) => {
    try {
      // TODO: Add admin role check
      const reviewerId = getUserId(req);
      const { status, notes } = req.body;
      const reviewedBiodata = await storage.reviewBiodata(Number(req.params.id), reviewerId, status, notes);
      if (!reviewedBiodata) return res.status(404).json({ message: "Biodata not found" });
      res.json(reviewedBiodata);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
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
