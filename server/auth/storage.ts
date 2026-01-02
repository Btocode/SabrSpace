import { db } from "../db";
import { users, anonymousSessions } from "@shared/models/auth";
import { eq, and, desc } from "drizzle-orm";
import type { UpsertUser, InsertAnonymousSession } from "@shared/models/auth";

export interface IAuthStorage {
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  upsertUser(user: UpsertUser): Promise<any>;
  createAnonymousUser(): Promise<string>;

  // Anonymous session management
  getActiveAnonymousSession(ipAddress: string): Promise<any>;
  createAnonymousSession(ipAddress: string, userId: string): Promise<string>;
  updateAnonymousSessionLastAccessed(sessionId: string): Promise<void>;
  deactivateAnonymousSession(sessionId: string): Promise<void>;
  getAnonymousSessionByUserId(userId: string): Promise<any>;
}

export class AuthStorage implements IAuthStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user || null;
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user || null;
  }

  async upsertUser(userData: UpsertUser) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          password: userData.password,
          updatedAt: new Date(),
        },
      })
      .returning();

    return user;
  }

  async createAnonymousUser(): Promise<string> {
    // Generate a unique anonymous user ID
    const anonymousId = `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [user] = await db
      .insert(users)
      .values({
        id: anonymousId,
        email: null,
        password: null,
        firstName: "Anonymous",
        lastName: "User",
        profileImageUrl: null,
      })
      .returning();

    return user.id;
  }

  async getActiveAnonymousSession(ipAddress: string) {
    const [session] = await db
      .select()
      .from(anonymousSessions)
      .where(and(eq(anonymousSessions.ipAddress, ipAddress), eq(anonymousSessions.isActive, true)))
      .orderBy(desc(anonymousSessions.lastAccessedAt))
      .limit(1);

    if (!session) return null;

    // Update last accessed time
    await this.updateAnonymousSessionLastAccessed(session.id);

    return session;
  }

  async createAnonymousSession(ipAddress: string, userId: string): Promise<string> {
    const [session] = await db
      .insert(anonymousSessions)
      .values({
        ipAddress,
        userId,
        isActive: true,
      })
      .returning();

    return session.id;
  }

  async updateAnonymousSessionLastAccessed(sessionId: string): Promise<void> {
    await db
      .update(anonymousSessions)
      .set({ lastAccessedAt: new Date() })
      .where(eq(anonymousSessions.id, sessionId));
  }

  async deactivateAnonymousSession(sessionId: string): Promise<void> {
    await db
      .update(anonymousSessions)
      .set({ isActive: false })
      .where(eq(anonymousSessions.id, sessionId));
  }

  async getAnonymousSessionByUserId(userId: string) {
    const [session] = await db
      .select()
      .from(anonymousSessions)
      .where(and(eq(anonymousSessions.userId, userId), eq(anonymousSessions.isActive, true)))
      .limit(1);

    return session || null;
  }
}

export const authStorage = new AuthStorage();
