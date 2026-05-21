import { ErrorWithProps } from 'mercurius';

export const authError = (message = 'Authentication required') =>
  new ErrorWithProps(message, { code: 'UNAUTHENTICATED' });

export const validationError = (message: string, details?: unknown) =>
  new ErrorWithProps(message, { code: 'BAD_USER_INPUT', details });
