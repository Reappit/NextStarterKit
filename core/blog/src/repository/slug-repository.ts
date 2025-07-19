import { db, desc, eq } from '@reappit/common-db';
import {
  slugTable,
  type insertSlugSchemaType,
} from '@reappit/common-db/schema';
import { SlugDto } from '../dto';

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

  getSlugById(id: number) {
    return db.query.slugTable.findFirst({
      where: eq(slugTable.id, id),
    });
  },

  saveSlug(slug: SlugDto) {
    return db.insert(slugTable).values(slug);
  },

  updateSlug(slug: insertSlugSchemaType) {
    return db.update(slugTable).set(slug).where(eq(slugTable.id, slug.id!));
  },
};

export { slugRepository };
