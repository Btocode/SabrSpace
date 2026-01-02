import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionSets = pgTable("question_sets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  token: text("token").notNull().unique(), // Shareable token
  isOpen: boolean("is_open").default(true).notNull(),
  requireAttestation: boolean("require_attestation").default(false).notNull(),
  allowAnonymous: boolean("allow_anonymous").default(false).notNull(),
  allowMultipleSubmissions: boolean("allow_multiple_submissions").default(false).notNull(),
  defaultLocale: text("default_locale").default("en").notNull(), // 'en' or 'bn'
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  setId: integer("set_id").notNull(),
  order: integer("order").notNull(),
  type: text("type").notNull(), // 'TEXT' or 'CHOICE'
  prompt: text("prompt").notNull(),
  options: jsonb("options"), // Array of strings for choices
  required: boolean("required").default(true).notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  setId: integer("set_id").notNull(),
  responderName: text("responder_name"), // Nullable if anonymous
  attestationAcceptedAt: timestamp("attestation_accepted_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  localeUsed: text("locale_used").default("en").notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  responseId: integer("response_id").notNull(),
  questionId: integer("question_id").notNull(),
  value: text("value"), // JSON string or raw text
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'NEW_RESPONSE'
  entityId: integer("entity_id").notNull(), // responseId or setId
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  questionSets: many(questionSets),
  notifications: many(notifications),
}));

export const questionSetsRelations = relations(questionSets, ({ one, many }) => ({
  user: one(users, {
    fields: [questionSets.userId],
    references: [users.id],
  }),
  questions: many(questions),
  responses: many(responses),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  set: one(questionSets, {
    fields: [questions.setId],
    references: [questionSets.id],
  }),
  answers: many(answers),
}));

export const responsesRelations = relations(responses, ({ one, many }) => ({
  set: one(questionSets, {
    fields: [responses.setId],
    references: [questionSets.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  response: one(responses, {
    fields: [answers.responseId],
    references: [responses.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertQuestionSetSchema = createInsertSchema(questionSets).omit({ id: true, userId: true, views: true, createdAt: true, updatedAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true, setId: true });
export const insertResponseSchema = createInsertSchema(responses).omit({ id: true, setId: true, submittedAt: true });
export const insertAnswerSchema = createInsertSchema(answers).omit({ id: true, responseId: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type QuestionSet = typeof questionSets.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Response = typeof responses.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestionSet = z.infer<typeof insertQuestionSetSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;

// === API CONTRACT TYPES ===

// Create Set Request (Includes questions)
export const createSetSchema = insertQuestionSetSchema.extend({
  questions: z.array(insertQuestionSchema)
});
export type CreateSetRequest = z.infer<typeof createSetSchema>;

// Update Set Request
export const updateSetSchema = insertQuestionSetSchema.partial().extend({
  questions: z.array(insertQuestionSchema.extend({ id: z.number().optional() })).optional()
});
export type UpdateSetRequest = z.infer<typeof updateSetSchema>;

// Submit Response Request (Includes answers)
export const submitResponseSchema = insertResponseSchema.extend({
  answers: z.array(z.object({
    questionId: z.number(),
    value: z.string()
  }))
});
export type SubmitResponseRequest = z.infer<typeof submitResponseSchema>;

// Full Set with Questions
export type QuestionSetWithQuestions = QuestionSet & { questions: Question[] };

// Full Response with Answers
export type ResponseWithDetails = Response & { answers: (Answer & { question: Question })[] };
