import { type z } from 'zod/v4';

import {
  insertSlugSchema,
  selectCategorySchema,
  selectSlugSchema,
  selectUserSchema,
} from '@workspace/db/*';

export const SlugDto = selectSlugSchema.extend({
  category: selectCategorySchema.optional(),
  author: selectUserSchema.pick({ login: true }),
});

export const SlugInsertDto = insertSlugSchema;

export type SlugDto = z.infer<typeof SlugDto>;
export type SlugInsertDto = z.infer<typeof SlugInsertDto>;
