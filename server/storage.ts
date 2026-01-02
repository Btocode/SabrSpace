import { db } from "./db";
import {
  questionSets,
  questions,
  responses,
  answers,
  notifications,
  type QuestionSet,
  type Question,
  type Response,
  type Answer,
  type Notification,
  type InsertQuestionSet,
  type InsertQuestion,
  type InsertResponse,
  type InsertAnswer,
  type CreateSetRequest,
  type UpdateSetRequest,
  type SubmitResponseRequest,
  type QuestionSetWithQuestions,
  type ResponseWithDetails,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // Sets
  getQuestionSet(id: number): Promise<QuestionSetWithQuestions | undefined>;
  getQuestionSetByToken(
    token: string
  ): Promise<QuestionSetWithQuestions | undefined>;
  createQuestionSet(
    userId: string,
    data: CreateSetRequest
  ): Promise<QuestionSetWithQuestions>;
  updateQuestionSet(
    id: number,
    userId: string,
    data: UpdateSetRequest
  ): Promise<QuestionSetWithQuestions | undefined>;
  deleteQuestionSet(id: number, userId: string): Promise<void>;
  listQuestionSets(userId: string): Promise<QuestionSet[]>;
  regenerateToken(id: number, userId: string): Promise<string>;

  // Responses
  submitResponse(token: string, data: SubmitResponseRequest): Promise<Response>;
  getResponses(setId: number, userId: string): Promise<ResponseWithDetails[]>;

  // Dashboard
  getStats(
    userId: string
  ): Promise<{ totalSets: number; totalResponses: number; totalViews: number }>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationsRead(userId: string): Promise<void>;

  // Internal
  incrementViews(setId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getQuestionSet(
    id: number
  ): Promise<QuestionSetWithQuestions | undefined> {
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

  async getQuestionSetByToken(
    token: string
  ): Promise<QuestionSetWithQuestions | undefined> {
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

  async createQuestionSet(
    userId: string,
    data: CreateSetRequest
  ): Promise<QuestionSetWithQuestions> {
    const token = randomBytes(16).toString("base64url");

    return await db.transaction(async (tx) => {
      const [newSet] = await tx
        .insert(questionSets)
        .values({
          userId,
          title: data.title,
          description: data.description,
          token,
          isOpen: data.isOpen,
          requireAttestation: data.requireAttestation,
          allowAnonymous: data.allowAnonymous,
          allowMultipleSubmissions: data.allowMultipleSubmissions,
          defaultLocale: data.defaultLocale,
        })
        .returning();

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        await tx.insert(questions).values(
          (data.questions as InsertQuestion[]).map((q, idx) => ({
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

  async updateQuestionSet(
    id: number,
    userId: string,
    data: UpdateSetRequest
  ): Promise<QuestionSetWithQuestions | undefined> {
    const existing = await this.getQuestionSet(id);
    if (!existing || existing.userId !== userId) return undefined;

    return await db.transaction(async (tx) => {
      await tx
        .update(questionSets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(questionSets.id, id));

      if (data.questions && Array.isArray(data.questions)) {
        // Simple strategy: delete all and recreate for simplicity in this MVP
        // A better strategy would be to diff and update
        await tx.delete(questions).where(eq(questions.setId, id));
        if (data.questions.length > 0) {
          await tx.insert(questions).values(
            (data.questions as InsertQuestion[]).map((q, idx) => ({
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
    return await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.userId, userId));
  }

  async regenerateToken(id: number, userId: string): Promise<string> {
    const existing = await this.getQuestionSet(id);
    if (!existing || existing.userId !== userId)
      throw new Error("Unauthorized");

    const newToken = randomBytes(16).toString("base64url");
    await db
      .update(questionSets)
      .set({ token: newToken })
      .where(eq(questionSets.id, id));
    return newToken;
  }

  async submitResponse(
    token: string,
    data: SubmitResponseRequest
  ): Promise<Response> {
    const set = await this.getQuestionSetByToken(token);
    if (!set) throw new Error("Set not found");
    if (!set.isOpen) throw new Error("Set is closed");

    return await db.transaction(async (tx) => {
      const [newResponse] = await tx
        .insert(responses)
        .values({
          setId: set.id,
          responderName: data.responderName,
          attestationAcceptedAt: data.attestationAcceptedAt
            ? new Date(data.attestationAcceptedAt)
            : null,
          localeUsed: data.localeUsed,
        })
        .returning();

      if (data.answers && Array.isArray(data.answers) && data.answers.length > 0) {
        await tx.insert(answers).values(
          data.answers.map((a: any) => ({
            responseId: newResponse.id,
            questionId: a.questionId,
            value: a.value,
          }))
        );
      }

      // Create notification
      await tx.insert(notifications).values({
        userId: set.userId,
        type: "NEW_RESPONSE",
        entityId: newResponse.id,
      });

      return newResponse;
    });
  }

  async getResponses(
    setId: number,
    userId: string
  ): Promise<ResponseWithDetails[]> {
    const set = await this.getQuestionSet(setId);
    if (!set || set.userId !== userId) throw new Error("Unauthorized");

    const res = await db.query.responses.findMany({
      where: eq(responses.setId, setId),
      with: {
        answers: {
          with: {
            question: true,
          },
        },
      },
      orderBy: (responses, { desc }) => [desc(responses.submittedAt)],
    });
    return res as ResponseWithDetails[];
  }

  async getStats(
    userId: string
  ): Promise<{
    totalSets: number;
    totalResponses: number;
    totalViews: number;
  }> {
    const sets = await this.listQuestionSets(userId);
    const setIds = sets.map((s) => s.id);

    let totalResponses = 0;
    if (setIds.length > 0) {
      const resCount = await db
        .select({ count: sql<number>`count(*)` })
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
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }

  async markNotificationsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false))
      );
  }

  async incrementViews(setId: number): Promise<void> {
    await db
      .update(questionSets)
      .set({ views: sql`${questionSets.views} + 1` })
      .where(eq(questionSets.id, setId));
  }
}

// Important: authStorage is now handled by the integration
export { authStorage, type IAuthStorage } from "./replit_integrations/auth";
export const storage = new DatabaseStorage();
