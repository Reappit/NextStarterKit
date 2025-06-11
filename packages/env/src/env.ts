import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    DATABASE_URL: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // STRIPE_API_KEY: z.string().min(1),
    // STRIPE_WEBHOOK_SECRET: z.string().min(1),
    // PRICE_ID: z.string().min(1),
    // HOSTNAME: z.string().min(1),
    PLAUSIBLE_URL: z.string().min(1),
    // MONGODB_URI: z.string().min(1),
    // S3_ENDPOINT: z.string(),
    // S3_PORT: z.string().optional(),
    // S3_ACCESS_KEY: z.string(),
    // S3_SECRET_KEY: z.string(),
    // S3_BUCKET_NAME: z.string(),
    // S3_USE_SSL: z.string().optional(),
    APP_URL: z.string().min(1),
    // R2_ACCOUNT_ID: z.string().min(1),
    R2_TOKEN_VALUE: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_S3_URL: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    IMAGE_BASE_URL: z.string().min(1),
    // OPEN_AI_API_KEY: z.string().min(1),
    // UPSTASH_REDIS_REST_URL: z.string().min(1),
    // UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_IMAGE_BASE_URL: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_KEY: z.string().min(1),
    // NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    // NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    // NEXT_PUBLIC_PROJECT_PLANNER_ID: z.string().min(1),
    // NEXT_PUBLIC_SKIP_EVENTS: z.string().optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    PLAUSIBLE_URL: process.env.PLAUSIBLE_URL,
    APP_URL: process.env.APP_URL,
    // R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_TOKEN_VALUE: process.env.R2_TOKEN_VALUE,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_S3_URL: process.env.R2_S3_URL,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
    // UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    // UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    // NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    // NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
