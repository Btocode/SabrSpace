import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table for custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email"),
  password: varchar("password"), // Nullable for anonymous users
  firstName: varchar("first_name"), // Nullable for anonymous users
  lastName: varchar("last_name"), // Nullable for anonymous users
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Anonymous sessions table for IP-based session persistence
export const anonymousSessions = pgTable("anonymous_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: varchar("ip_address").notNull(),
  userId: varchar("user_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  anonymousSessions: many(anonymousSessions),
}));

export const anonymousSessionsRelations = relations(anonymousSessions, ({ one }) => ({
  user: one(users, {
    fields: [anonymousSessions.userId],
    references: [users.id],
  }),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type AnonymousSession = typeof anonymousSessions.$inferSelect;
export type InsertAnonymousSession = typeof anonymousSessions.$inferInsert;
