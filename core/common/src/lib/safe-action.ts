import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import env from '@reappit/env/*';
import { ActionError } from './exceptions';
import { getIp } from './get-ip';
import { assertAuthenticated } from './session';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimit = new Ratelimit({
  redis,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

function shapeErrors(err: Error) {
  const isAllowedError = err instanceof ActionError;
  const isDev = env.NODE_ENV === 'development';
  if (isAllowedError || isDev) {
    console.error(err);
    const error = err as unknown as ActionError;
    return {
      code: error.code ?? 'ERROR',
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${
        error.message
      }`,
    };
  } else {
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    };
  }
}

const action = createSafeActionClient({
  handleServerError: shapeErrors,
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authAction = action.use(async ({ next, ctx }) => {
  const user = await assertAuthenticated();
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const unauthenticatedAction = action;

export const unauthenticatedRateLimitedAction = action.use(async props => {
  const ip = (await getIp()) ?? '127.0.0.1';

  const { success } = await rateLimit.limit(ip);
  if (!success) {
    throw new ActionError('Too many requests', 429);
  }

  return props.next({
    ctx: props.ctx,
  });
});
