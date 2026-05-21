import type { AuthUser } from '../types';
import { authError } from './errors';

export const requireUser = (user: AuthUser | null) => {
  if (!user) {
    throw authError();
  }
  return user;
};
