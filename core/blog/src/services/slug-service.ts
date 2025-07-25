import { SlugDto } from '../dto';
import { slugRepository } from '../repository';

const slugService = {
  async saveSlug(slug: SlugDto) {
    return slugRepository.saveSlug(slug);
  },
  getSlugs(allSlugs: boolean = false) {
    return slugRepository.getSlugs(allSlugs);
  },
  async getSlugById(id: number): Promise<SlugDto> {
    const slug = await slugRepository.getSlugById(id);
    return SlugDto.parse(slug);
  },
};

export { slugService };
