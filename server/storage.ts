import { 
  db 
} from "./db";
import {
  users, questionSets, questions, responses, answers, notifications, biodata, biodataReviews,
  type User, type QuestionSet, type Question, type Response, type Answer, type Notification, type Biodata, type BiodataReview,
  type InsertUser, type InsertQuestionSet, type InsertQuestion, type InsertResponse, type InsertAnswer, type InsertBiodata, type InsertBiodataReview,
  type CreateSetRequest, type UpdateSetRequest, type SubmitResponseRequest, type CreateBiodataRequest, type UpdateBiodataRequest, type PublishBiodataRequest,
  type QuestionSetWithQuestions, type ResponseWithDetails, type BiodataWithDetails
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // Sets
  getQuestionSet(id: number): Promise<QuestionSetWithQuestions | undefined>;
  getQuestionSetByToken(token: string): Promise<QuestionSetWithQuestions | undefined>;
  createQuestionSet(userId: string, data: CreateSetRequest): Promise<QuestionSetWithQuestions>;
  updateQuestionSet(id: number, userId: string, data: UpdateSetRequest): Promise<QuestionSetWithQuestions | undefined>;
  deleteQuestionSet(id: number, userId: string): Promise<void>;
  listQuestionSets(userId: string): Promise<QuestionSet[]>;
  regenerateToken(id: number, userId: string): Promise<string>;

  // Responses
  submitResponse(token: string, data: SubmitResponseRequest, userId?: string): Promise<Response>;
  getResponses(setId: number, userId: string): Promise<ResponseWithDetails[]>;
  
  // Dashboard
  getStats(userId: string): Promise<{ totalSets: number; totalResponses: number; totalViews: number }>;
  
  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationsRead(userId: string): Promise<void>;

  // Biodata
  getBiodata(id: number): Promise<BiodataWithDetails | undefined>;
  getBiodataByToken(token: string): Promise<Biodata | undefined>;
  createBiodata(userId: string, data: CreateBiodataRequest): Promise<Biodata>;
  updateBiodata(id: number, userId: string, data: UpdateBiodataRequest): Promise<Biodata | undefined>;
  deleteBiodata(id: number, userId: string): Promise<void>;
  listBiodata(userId: string): Promise<Biodata[]>;
  publishBiodata(id: number, userId: string): Promise<Biodata | undefined>;
  getPendingBiodata(): Promise<Biodata[]>;
  reviewBiodata(id: number, reviewerId: string, status: string, notes?: string): Promise<Biodata | undefined>;

  // Internal
  incrementViews(setId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getQuestionSet(id: number): Promise<QuestionSetWithQuestions | undefined> {
    const set = await db.query.questionSets.findFirst({
      where: eq(questionSets.id, id),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)],
        },
      },
    });
    return set as QuestionSetWithQuestions | undefined;
  }

  async getQuestionSetByToken(token: string): Promise<QuestionSetWithQuestions | undefined> {
    const set = await db.query.questionSets.findFirst({
      where: eq(questionSets.token, token),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)],
        },
      },
    });
    return set as QuestionSetWithQuestions | undefined;
  }

  async createQuestionSet(userId: string, data: CreateSetRequest): Promise<QuestionSetWithQuestions> {
    const token = randomBytes(16).toString('base64url');
    
    return await db.transaction(async (tx) => {
      const [newSet] = await tx.insert(questionSets).values({
        userId,
        title: data.title,
        description: data.description,
        token,
        isOpen: data.isOpen,
        requireAttestation: data.requireAttestation,
        allowAnonymous: data.allowAnonymous,
        allowMultipleSubmissions: data.allowMultipleSubmissions,
        defaultLocale: data.defaultLocale,
      }).returning();

      if (data.questions && (data.questions as any[]).length > 0) {
        await tx.insert(questions).values(
          (data.questions as any[]).map((q, idx) => ({
            ...q,
            setId: newSet.id,
            order: idx,
          }))
        );
      }

      const set = await tx.query.questionSets.findFirst({
        where: eq(questionSets.id, newSet.id),
        with: {
          questions: {
            orderBy: (questions, { asc }) => [asc(questions.order)],
          },
        },
      });
      return set as QuestionSetWithQuestions;
    });
  }

  async updateQuestionSet(id: number, userId: string, data: UpdateSetRequest): Promise<QuestionSetWithQuestions | undefined> {
    const existing = await this.getQuestionSet(id);
    if (!existing || existing.userId !== userId) return undefined;

    return await db.transaction(async (tx) => {
      await tx.update(questionSets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(questionSets.id, id));

      if (data.questions) {
        // Simple strategy: delete all and recreate for simplicity in this MVP
        // A better strategy would be to diff and update
        await tx.delete(questions).where(eq(questions.setId, id));
        if (data.questions && (data.questions as any[]).length > 0) {
          await tx.insert(questions).values(
            (data.questions as any[]).map((q, idx) => ({
              ...q,
              setId: id,
              order: idx,
            }))
          );
        }
      }

      const set = await tx.query.questionSets.findFirst({
        where: eq(questionSets.id, id),
        with: {
          questions: {
            orderBy: (questions, { asc }) => [asc(questions.order)],
          },
        },
      });
      return set as QuestionSetWithQuestions;
    });
  }

  async deleteQuestionSet(id: number, userId: string): Promise<void> {
    const existing = await this.getQuestionSet(id);
    if (!existing || existing.userId !== userId) return;
    
    await db.delete(questionSets).where(eq(questionSets.id, id));
  }

  async listQuestionSets(userId: string): Promise<QuestionSet[]> {
    return await db.select().from(questionSets).where(eq(questionSets.userId, userId));
  }

  async regenerateToken(id: number, userId: string): Promise<string> {
    const existing = await this.getQuestionSet(id);
    if (!existing || existing.userId !== userId) throw new Error("Unauthorized");

    const newToken = randomBytes(16).toString('base64url');
    await db.update(questionSets).set({ token: newToken }).where(eq(questionSets.id, id));
    return newToken;
  }

  async submitResponse(token: string, data: SubmitResponseRequest, userId?: string): Promise<Response> {
    const set = await this.getQuestionSetByToken(token);
    if (!set) throw new Error("Set not found");
    if (!set.isOpen) throw new Error("Set is closed");

    return await db.transaction(async (tx) => {
      const [newResponse] = await tx.insert(responses).values({
        setId: set.id,
        userId: userId || null,
        responderName: data.responderName,
        attestationAcceptedAt: data.attestationAcceptedAt ? new Date(data.attestationAcceptedAt) : null,
        localeUsed: data.localeUsed,
      }).returning();

      if (data.answers && (data.answers as any[]).length > 0) {
        await tx.insert(answers).values(
          (data.answers as any[]).map((a) => ({
            responseId: newResponse.id,
            questionId: a.questionId,
            value: a.value,
          }))
        );
      }

      // Create notification
      await tx.insert(notifications).values({
        userId: set.userId,
        type: 'NEW_RESPONSE',
        entityId: newResponse.id,
      });

      return newResponse;
    });
  }

  async getResponses(setId: number, userId: string): Promise<ResponseWithDetails[]> {
    const set = await this.getQuestionSet(setId);
    if (!set || set.userId !== userId) throw new Error("Unauthorized");

    const res = await db.query.responses.findMany({
      where: eq(responses.setId, setId),
      with: {
        answers: {
          with: {
            question: true
          }
        }
      },
      orderBy: (responses, { desc }) => [desc(responses.submittedAt)],
    });
    return res as ResponseWithDetails[];
  }

  async getStats(userId: string): Promise<{ totalSets: number; totalResponses: number; totalViews: number }> {
    const sets = await this.listQuestionSets(userId);
    const setIds = sets.map(s => s.id);
    
    let totalResponses = 0;
    if (setIds.length > 0) {
      const resCount = await db.select({ count: sql<number>`count(*)` })
        .from(responses)
        .where(sql`${responses.setId} IN ${setIds}`);
      totalResponses = Number(resCount[0]?.count || 0);
    }

    const totalViews = sets.reduce((acc, s) => acc + s.views, 0);

    return {
      totalSets: sets.length,
      totalResponses,
      totalViews,
    };
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }

  async markNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  }

  async incrementViews(setId: number): Promise<void> {
    await db.update(questionSets)
      .set({ views: sql`${questionSets.views} + 1` })
      .where(eq(questionSets.id, setId));
  }

  // Biodata methods
  async getBiodata(id: number): Promise<BiodataWithDetails | undefined> {
    const biodataEntry = await db.query.biodata.findFirst({
      where: eq(biodata.id, id),
      with: {
        user: true,
        reviews: {
          with: {
            reviewer: true,
          },
        },
        reviewer: true,
      },
    });
    return biodataEntry as BiodataWithDetails | undefined;
  }

  async getBiodataByToken(token: string): Promise<Biodata | undefined> {
    return await db.query.biodata.findFirst({
      where: eq(biodata.token, token),
    });
  }

  async createBiodata(userId: string, data: CreateBiodataRequest): Promise<Biodata> {
    try {
      console.log('Creating biodata for user:', userId);
      console.log('Data received:', JSON.stringify(data, null, 2));

      const token = randomBytes(16).toString('hex');
      const insertData = {
        ...data,
        userId,
        token,
        status: 'draft',
      };

      console.log('Insert data:', JSON.stringify(insertData, null, 2));

      const [newBiodata] = await db.insert(biodata).values([insertData]).returning();
      console.log('Biodata created successfully:', newBiodata.id);
      return newBiodata;
    } catch (error) {
      console.error('Database error in createBiodata:', error);
      throw error;
    }
  }

  async updateBiodata(id: number, userId: string, data: UpdateBiodataRequest): Promise<Biodata | undefined> {
    const existing = await this.getBiodata(id);
    if (!existing || existing.userId !== userId) return undefined;

    const [updated] = await db.update(biodata)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(biodata.id, id), eq(biodata.userId, userId)))
      .returning();
    return updated;
  }

  async deleteBiodata(id: number, userId: string): Promise<void> {
    await db.delete(biodata)
      .where(and(eq(biodata.id, id), eq(biodata.userId, userId)));
  }

  async listBiodata(userId: string): Promise<Biodata[]> {
    return await db.select().from(biodata)
      .where(eq(biodata.userId, userId))
      .orderBy(desc(biodata.updatedAt));
  }

  async publishBiodata(id: number, userId: string): Promise<Biodata | undefined> {
    // Only allow publishing if user is authenticated (not anonymous)
    // Check if user has email (anonymous users don't)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user?.email) {
      throw new Error('Authentication required for publishing biodata');
    }

    const [updated] = await db.update(biodata)
      .set({
        status: 'pending_review',
        updatedAt: new Date()
      })
      .where(and(eq(biodata.id, id), eq(biodata.userId, userId)))
      .returning();
    return updated;
  }

  async getPendingBiodata(): Promise<Biodata[]> {
    return await db.select().from(biodata)
      .where(eq(biodata.status, 'pending_review'))
      .orderBy(desc(biodata.createdAt));
  }

  async reviewBiodata(id: number, reviewerId: string, status: string, notes?: string): Promise<Biodata | undefined> {
    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Update biodata status
      const [updatedBiodata] = await tx.update(biodata)
        .set({
          status: status === 'approved' ? 'published' : 'rejected',
          reviewedAt: new Date(),
          reviewedBy: reviewerId,
          reviewNotes: notes,
          publishedAt: status === 'approved' ? new Date() : undefined,
        })
        .where(eq(biodata.id, id))
        .returning();

      // Create review record
      await tx.insert(biodataReviews).values({
        biodataId: id,
        reviewerId,
        status: status === 'approved' ? 'approved' : 'rejected',
        notes: notes || '',
      });

      return updatedBiodata;
    });

    return result;
  }
}

// Important: authStorage is now handled by the integration
// Auth storage is now in server/auth/storage.ts
export const storage = new DatabaseStorage();
