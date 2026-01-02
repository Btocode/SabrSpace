import { drizzle } from "drizzle-orm/node-postgres";
// @ts-ignore - pg types are not properly exported for ESM
import pg from "pg";
import dotenv from "dotenv";
import * as schema from "@shared/schema";

// Load environment variables from .env file
dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
