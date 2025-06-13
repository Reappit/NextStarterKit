import { type Config } from 'drizzle-kit';

// import env from '@workspace/env/*';

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ""
  },
  verbose: true,
  strict: true,
} satisfies Config;
