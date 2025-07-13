import { SlugDto } from '@/src/dto/slug-dto';
import { slugRepository } from '@/src/repository';

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
