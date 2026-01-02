import { Router } from "express";
import { z } from "zod";
import { authStorage } from "./storage";
import { generateToken, hashPassword, verifyPassword } from "./index";
import type { Request, Response } from "express";

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
});

// Login route
router.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await authStorage.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register route
router.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await authStorage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await authStorage.upsertUser({
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      firstName,
      lastName: lastName || "",
      profileImageUrl: null,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Anonymous access route - now supports IP-based session persistence
router.post("/api/auth/anonymous", async (req: Request, res: Response) => {
  try {
    const clientIP = (req as any).clientIP as string;
    console.log("Anonymous login attempt from IP:", clientIP);

    // Check if this IP already has an active anonymous session
    const existingSession = await authStorage.getActiveAnonymousSession(clientIP);

    if (existingSession) {
      console.log("Found existing anonymous session for IP:", clientIP, "User ID:", existingSession.userId);

      // Get the existing user
      const user = await authStorage.getUser(existingSession.userId);
      if (!user) {
        console.log("Existing user not found, creating new one");
        // If user doesn't exist, create a new one (edge case)
        const userId = await authStorage.createAnonymousUser();
        await authStorage.createAnonymousSession(clientIP, userId);
        const newUser = await authStorage.getUser(userId);

        const token = generateToken(userId);
        return res.json({
          token,
          user: {
            id: newUser!.id,
            email: newUser!.email,
            firstName: newUser!.firstName,
            lastName: newUser!.lastName,
            profileImageUrl: newUser!.profileImageUrl,
          },
          isReturningSession: false,
        });
      }

      // Return existing session
      const token = generateToken(user.id);
      console.log("Returning existing anonymous session for user:", user.id);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
        },
        isReturningSession: true,
      });
    } else {
      console.log("Creating new anonymous user and session for IP:", clientIP);
      // Create new anonymous user and session
      const userId = await authStorage.createAnonymousUser();
      await authStorage.createAnonymousSession(clientIP, userId);

      const token = generateToken(userId);
      console.log("New anonymous user created with ID:", userId);

      // Get the created user
      const user = await authStorage.getUser(userId);
      console.log("User retrieved:", user);

      if (!user) {
        throw new Error("Failed to retrieve created user");
      }

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
        },
        isReturningSession: false,
      });
    }
  } catch (error) {
    console.error("Anonymous login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
});

// Get current user
router.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    // This route expects authentication middleware to set req.user
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await authStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route - deactivates anonymous sessions
router.post("/api/auth/logout", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if this is an anonymous user and deactivate their session
    const session = await authStorage.getAnonymousSessionByUserId(userId);
    if (session) {
      console.log("Deactivating anonymous session for user:", userId, "session:", session.id);
      await authStorage.deactivateAnonymousSession(session.id);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as authRoutes };
