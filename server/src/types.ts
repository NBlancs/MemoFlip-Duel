import type { PrismaClient } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

export interface AuthUser {
  id: string;
  email: string;
}

export interface GraphQLContext {
  request: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaClient;
  user: AuthUser | null;
}
