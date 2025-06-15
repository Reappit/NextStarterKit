import { boolean, timestamp, pgTable, text, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { categoryTable, slugTable, userTable } from '@workspace/common-repo/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

// common-repo db schema
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
}).enableRLS();

export const feedbackTableRelations = relations(feedbackTable, ({ one }) => ({
  userId: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));

export const selectUserSchema = createSelectSchema(userTable);
export const selectFeedbackSchema = createSelectSchema(feedbackTable);

export const selectSlugSchema = createSelectSchema(slugTable);
export type selectSlugSchemaType = z.infer<typeof selectSlugSchema>;

export const insertSlugSchema = createInsertSchema(slugTable);
export type insertSlugSchemaType = z.infer<typeof insertSlugSchema>;

export const insertCategorySchema = createInsertSchema(categoryTable);
export const selectCategorySchema = createInsertSchema(categoryTable);
