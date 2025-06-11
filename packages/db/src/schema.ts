import {
  boolean,
  timestamp,
  pgTable,
  text,
  serial,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { userTable } from '@workspace/common-repo/db';

export * from '@workspace/common-repo/db';

export const feedbackTable = pgTable('feedback', {
  id: serial('id').primaryKey(),
  comment: text('text').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  userId: text('userId').references(() => userTable.id),
  approved: boolean('approved').notNull(),
  reviewedAt: timestamp('reviewed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const feedbackTableRelations = relations(feedbackTable, ({ one }) => ({
  userId: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));
