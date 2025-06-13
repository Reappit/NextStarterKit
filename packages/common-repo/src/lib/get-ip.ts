import { headers as headersPromise } from 'next/headers';

export async function getIp() {
  const headers = await headersPromise();
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}
