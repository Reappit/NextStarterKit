import { type Config } from 'drizzle-kit';
import env from '@workspace/env/*';

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  entities: {
    roles: true
  }
} satisfies Config;
