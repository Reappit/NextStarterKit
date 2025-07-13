'use server';

import { unauthenticatedAction } from '@reappit/common/*';
import { slugService } from '@/src/services/slug-service';

export const getSlugById = unauthenticatedAction
  .metadata({
    actionName: 'getSlugById',
  })
  .action(async ({ ctx }) => {
    return slugService.getSlugById('1');
  });
