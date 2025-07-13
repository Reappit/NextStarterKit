import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { headers } from 'next/headers';
import { cache } from 'react';

import { db } from '@reappit/db/*';
import env from '@reappit/env/*';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  user: {
    modelName: 'userTable',
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  session: {
    modelName: 'sessionTable',
  },
  account: {
    modelName: 'accountTable',
  },
  verification: {
    modelName: 'verificationTable',
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
