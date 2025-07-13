'use server';

import { unauthenticatedAction } from '@reappit/common-repo/*';
import { slugService } from '@reappit/services/*';

export const getSlugById = unauthenticatedAction
  .metadata({
    actionName: 'getSlugById',
  })
  .action(async ({ ctx }) => {
    return slugService.getSlugById('1');
  });
