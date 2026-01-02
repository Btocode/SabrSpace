import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "@shared/schema";

// Load environment variables from .env file
config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema });
