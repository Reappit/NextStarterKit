import { SlugDto } from '@workspace/dto/*';
import { slugRepository } from '@workspace/repository/*';

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
