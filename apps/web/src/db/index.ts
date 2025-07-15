import { getDb } from '@reappit/common-db';
import * as schema from './schema';
import * as commonSchema from '@reappit/common-db/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Create a lazy database instance that only initializes when accessed
let _db: PostgresJsDatabase<typeof schema & typeof commonSchema> | undefined;

if (!_db) {
  _db = getDb<typeof schema>(schema);
}
export default _db!;
