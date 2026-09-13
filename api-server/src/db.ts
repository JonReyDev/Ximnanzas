import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { appointmentsTable, prospectsTable } from './schema.js';

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to start the optional API server.');
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema: { appointmentsTable, prospectsTable } });
