import { type AnyColumn, eq, sql } from 'drizzle-orm';

import { db, type Transaction } from '@workspace/db/*';
import { userTable } from '@workspace/db/*';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

const userRepository = {
  async getUserByEmail(email: string) {
    return db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });
  },
};

export { userRepository };
