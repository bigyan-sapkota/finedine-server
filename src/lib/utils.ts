import { env } from '@/config/env.config';

export const devConsole = (...args: unknown[]) => {
  if (env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

export const sessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  httpOnly: env.NODE_ENV === 'production' ? true : false,
  maxAge: 365 * 24 * 60 * 60 * 1000,
  keys: [env.SESSION_SECRET],
  secure: env.NODE_ENV === 'production' ? true : false,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax'
};
