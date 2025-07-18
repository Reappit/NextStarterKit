import { type z } from 'zod';

import { selectUserSchema } from '@reappit/common-db';

export const UserDto = selectUserSchema;

export type UserDto = z.infer<typeof selectUserSchema>;
