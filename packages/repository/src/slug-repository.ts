import { desc, eq } from 'drizzle-orm';

import { db, type insertSlugSchemaType } from '@reappit/db/*';
import { slugTable } from '@reappit/db/*';

const slugRepository = {
  async getSlugs(allSlugs: boolean = false) {
    return db.query.slugTable.findMany({
      with: {
        category: true,
        author: true,
      },
      orderBy: [desc(slugTable.createdAt)],
      ...(!allSlugs
        ? {
            where: eq(slugTable.published, true),
          }
        : {}),
    });
  },

  getSlugById(id: string) {
    return db.query.slugTable.findFirst({
      where: eq(slugTable.id, id),
      with: {
        category: true,
        author: true,
      },
    });
  },

  saveSlug(slug: insertSlugSchemaType) {
    return db.insert(slugTable).values(slug);
  },

  updatePost(slug: insertSlugSchemaType) {
    return db.update(slugTable).set(slug).where(eq(slugTable.id, slug.id!));
  },
};

export { slugRepository };
