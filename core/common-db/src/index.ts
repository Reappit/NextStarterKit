import { type ExtractTablesWithRelations } from 'drizzle-orm';
import { type PgTransaction } from 'drizzle-orm/pg-core';
import {
  type PostgresJsDatabase,
  drizzle,
  type PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import env from '@reappit/env';

import * as schema from './schema';

export { schema };

// Create a lazy database instance that only initializes when accessed
let _db: ReturnType<typeof drizzle> | undefined;

export function getDb<T>(
  additionalSchema: T
): PostgresJsDatabase<typeof schema & T> {
  if (!_db) {
    const pg = postgres(env.DATABASE_URL);
    _db = drizzle(pg, { schema: { ...schema, ...additionalSchema } });
  }
  return _db!;
}

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
