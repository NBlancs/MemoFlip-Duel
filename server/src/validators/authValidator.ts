import { z } from 'zod';

import { validationError } from '../utils/errors';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  displayName: z.string().min(2).max(32),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const parseRegisterInput = (input: unknown): RegisterInput => {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    throw validationError('Invalid registration input', result.error.flatten());
  }
  return result.data;
};

export const parseLoginInput = (input: unknown): LoginInput => {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    throw validationError('Invalid login input', result.error.flatten());
  }
  return result.data;
};
