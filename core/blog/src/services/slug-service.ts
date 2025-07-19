import { SlugDto } from '../dto';
import { slugRepository } from '../repository';

const slugService = {
  async saveSlug(slug: SlugDto) {
    return slugRepository.saveSlug(slug);
  },
  getSlugs(allSlugs: boolean = false) {
    return slugRepository.getSlugs(allSlugs);
  },
  getSlugById(id: number) {
    return slugRepository.getSlugById(id);
  },
};

export { slugService };
