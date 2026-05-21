import type { PrismaClient } from '@prisma/client';

import type { LoginInput, RegisterInput } from '../validators/authValidator';
import { validationError } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/password';

export const registerPlayer = async (prisma: PrismaClient, input: RegisterInput) => {
  const email = input.email.toLowerCase();
  const existing = await prisma.player.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    throw validationError('Email is already registered');
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.player.create({
    data: {
      email,
      displayName: input.displayName,
      passwordHash,
    },
  });
};

export const loginPlayer = async (prisma: PrismaClient, input: LoginInput) => {
  const player = await prisma.player.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!player) {
    throw validationError('Invalid email or password');
  }

  const isValid = await verifyPassword(input.password, player.passwordHash);
  if (!isValid) {
    throw validationError('Invalid email or password');
  }

  return player;
};
