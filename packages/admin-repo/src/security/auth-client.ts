import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import env from '@workspace/env/*';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: 'string',
        },
      },
    }),
  ],
});

export const signinGoogle = async () => {
  return await authClient.signIn.social({
    provider: 'google',
  });
};

export const { signIn, signOut, useSession } = authClient;
