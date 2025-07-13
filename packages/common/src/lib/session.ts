import { getSession } from '../security';
import { ActionError } from './exceptions';

export const AUTHENTICATION_ERROR_MESSAGE =
  'You must be logged in to view this content';

export const AuthenticationError = class AuthenticationError extends ActionError {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = 'AuthenticationError';
    this.code = 401;
  }
};

export const assertAuthenticated = async () => {
  const session = await getSession();
  if (!session) {
    throw new AuthenticationError();
  }
  return session.user;
};
