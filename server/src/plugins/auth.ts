import jwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';

import { env } from '../config/env';

export const registerAuth = async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '7d',
    },
  });
};
