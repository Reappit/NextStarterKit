import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  serial,
} from 'drizzle-orm/pg-core';
import { userTable } from './security-db-schema';

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
