import { type z } from 'zod';

import { selectUserSchema } from '@workspace/db/*';

export const UserDto = selectUserSchema;

export type UserDto = z.infer<typeof selectUserSchema>;
