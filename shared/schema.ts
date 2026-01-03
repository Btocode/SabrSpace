import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";

// Import the users table for relations
import { users } from "./models/auth";

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
  userId: varchar("user_id"), // Nullable for anonymous responses
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

// === BIODATA TABLES ===

export const biodata = pgTable("biodata", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull().unique(), // Shareable token for private biodata
  status: text("status").notNull().default("draft"), // 'draft', 'pending_review', 'published', 'rejected'

  // Basic Information
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(), // 'male', 'female'
  dateOfBirth: timestamp("date_of_birth"),
  height: text("height"), // e.g., "5'6\""
  weight: text("weight"), // e.g., "70 kg"
  complexion: text("complexion"), // 'fair', 'wheatish', 'dark'
  bloodGroup: text("blood_group"),

  // Contact Information (only for published biodata)
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),

  // Education
  educationLevel: text("education_level"), // 'ssc', 'hsc', 'bachelors', 'masters', 'phd', etc.
  educationDetails: text("education_details"),
  profession: text("profession"),
  occupation: text("occupation"),
  annualIncome: text("annual_income"),
  workLocation: text("work_location"),

  // Family Information
  fatherName: text("father_name"),
  fatherOccupation: text("father_occupation"),
  motherName: text("mother_name"),
  motherOccupation: text("mother_occupation"),
  siblingsCount: integer("siblings_count"),
  siblingsDetails: text("siblings_details"),

  // Religious Information
  religion: text("religion").default("islam").notNull(),
  sect: text("sect"), // 'sunni', 'shia', etc.
  religiousPractice: text("religious_practice"), // 'regular', 'occasional', 'minimal'
  prayerFrequency: text("prayer_frequency"), // '5_times', '3_times', 'occasional'
  fasting: text("fasting"), // 'ramadan_only', 'regular', 'occasional'
  quranReading: text("quran_reading"), // 'daily', 'weekly', 'occasional', 'rarely'

  // Marriage Preferences
  maritalStatus: text("marital_status").default("never_married").notNull(), // 'never_married', 'divorced', 'widowed'
  willingToRelocate: boolean("willing_to_relocate").default(false),
  preferredAgeMin: integer("preferred_age_min"),
  preferredAgeMax: integer("preferred_age_max"),
  preferredEducation: text("preferred_education"),
  preferredProfession: text("preferred_profession"),
  preferredLocation: text("preferred_location"),
  otherPreferences: text("other_preferences"),

  // Additional Information
  hobbies: text("hobbies"),
  languages: text("languages"), // comma-separated
  aboutMe: text("about_me"),
  expectations: text("expectations"),

  // Media (URLs to uploaded photos)
  profilePhoto: text("profile_photo"),
  additionalPhotos: jsonb("additional_photos"), // array of URLs

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"), // admin user ID
  reviewNotes: text("review_notes"),
});

export const biodataReviews = pgTable("biodata_reviews", {
  id: serial("id").primaryKey(),
  biodataId: integer("biodata_id").notNull(),
  reviewerId: varchar("reviewer_id").notNull(),
  status: text("status").notNull(), // 'approved', 'rejected', 'needs_revision'
  notes: text("notes"),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  questionSets: many(questionSets),
  notifications: many(notifications),
  biodata: many(biodata),
  biodataReviews: many(biodataReviews),
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
  user: one(users, {
    fields: [responses.userId],
    references: [users.id],
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

export const biodataRelations = relations(biodata, ({ one, many }) => ({
  user: one(users, {
    fields: [biodata.userId],
    references: [users.id],
  }),
  reviews: many(biodataReviews),
  reviewer: one(users, {
    fields: [biodata.reviewedBy],
    references: [users.id],
  }),
}));

export const biodataReviewsRelations = relations(biodataReviews, ({ one }) => ({
  biodata: one(biodata, {
    fields: [biodataReviews.biodataId],
    references: [biodata.id],
  }),
  reviewer: one(users, {
    fields: [biodataReviews.reviewerId],
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
export const insertBiodataSchema = createInsertSchema(biodata).omit({ id: true, userId: true, token: true, createdAt: true, updatedAt: true, publishedAt: true, reviewedAt: true });
export const insertBiodataReviewSchema = createInsertSchema(biodataReviews).omit({ id: true, reviewedAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type QuestionSet = typeof questionSets.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Response = typeof responses.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Biodata = typeof biodata.$inferSelect;
export type BiodataReview = typeof biodataReviews.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestionSet = z.infer<typeof insertQuestionSetSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type InsertBiodata = z.infer<typeof insertBiodataSchema>;
export type InsertBiodataReview = z.infer<typeof insertBiodataReviewSchema>;

// === API CONTRACT TYPES ===

// Create Set Request (Includes questions, token generated internally)
export type CreateSetRequest = Omit<InsertQuestionSet, 'id' | 'userId' | 'token' | 'views' | 'createdAt' | 'updatedAt'> & {
  questions: Omit<InsertQuestion, 'id' | 'setId'>[];
};

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

// === BIODATA API CONTRACT TYPES ===

// Create Biodata Request
export const createBiodataSchema = insertBiodataSchema.omit({ 
  id: true, 
  userId: true, 
  token: true, 
  status: true, 
  createdAt: true, 
  updatedAt: true, 
  publishedAt: true, 
  reviewedAt: true,
  reviewedBy: true,
  reviewNotes: true,
  profilePhoto: true,
  additionalPhotos: true
});
export type CreateBiodataRequest = z.infer<typeof createBiodataSchema>;

// Update Biodata Request
export const updateBiodataSchema = insertBiodataSchema.partial();
export type UpdateBiodataRequest = z.infer<typeof updateBiodataSchema>;

// Publish Biodata Request (requires authentication)
export type PublishBiodataRequest = {
  biodataId: number;
};

// Biodata with Relations
export type BiodataWithDetails = Biodata & {
  user?: User;
  reviews?: BiodataReview[];
  reviewer?: User;
};
