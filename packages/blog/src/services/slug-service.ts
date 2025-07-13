import { SlugDto } from '@reappit/dto/*';
import { slugRepository } from '@reappit/repository/*';

const slugService = {
  async saveSlug(slug: SlugDto) {
    return await slugRepository;
  },
  getSlugs(allSlugs: boolean = false) {
    return slugRepository.getSlugs(allSlugs);
  },
  getSlugById(id: string) {
    return slugRepository.getSlugById(id);
  },
};

export { slugService };
