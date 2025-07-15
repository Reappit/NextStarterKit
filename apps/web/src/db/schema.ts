import { pgTable, text } from 'drizzle-orm/pg-core';

export * from '@reappit/common-db/schema';

export const test1 = pgTable('test1', {
  id: text('id').primaryKey(),
  name: text('test1').notNull(),
}).enableRLS();
