'use server';

import { unauthenticatedAction } from '@workspace/common-repo/*';
import { slugService } from '@workspace/services/*';

export const getSlugById = unauthenticatedAction
  .metadata({
    actionName: 'getSlugById',
  })
  .action(async ({ ctx }) => {
    return slugService.getSlugById('1');
  });
