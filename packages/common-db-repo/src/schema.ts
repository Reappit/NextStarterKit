import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  serial,
} from 'drizzle-orm/pg-core';
import { userTable } from './security-db-schema';
import { relations } from 'drizzle-orm/relations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export * from './security-db-schema';

export const slugTable = pgTable('slug', {
  id: serial('id').primaryKey(),

  title: text('title'),
  subTitle: text('sub_title'),
  shortStory: text('short_story'),
  fullStory: text('full_story'),

  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  metaTitle: text('meta_title'),
  ogImage: text('og_image'),
  canonicalUrl: text('canonical_url').notNull().unique(),

  published: boolean('published').default(false).notNull(),

  author: text('author')
    .notNull()
    .references(() => userTable.id),
  category: serial('category_id')
    .notNull()
    .references(() => categoryTable.id),

  readingTime: integer('reading_time'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS();

export const categoryTable = pgTable('category', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  canonicalUrl: text('canonical_url').notNull().unique(),
}).enableRLS();

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
