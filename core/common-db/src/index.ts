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

declare global {
  // eslint-disable-next-line no-var
  var db: PostgresJsDatabase | undefined;
}

let db: PostgresJsDatabase;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === 'production') {
  pg = postgres(env.DATABASE_URL);
  db = drizzle(pg);
} else {
  if (!global.db) {
    pg = postgres(env.DATABASE_URL);
    global.db = drizzle(pg);
  }
  db = global.db;
}

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export { db, pg };
