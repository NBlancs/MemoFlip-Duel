import fastify from 'fastify';
import mercurius from 'mercurius';

import { env } from './config/env';
import { registerAuth } from './plugins/auth';
import { registerCors } from './plugins/cors';
import { registerRateLimit } from './plugins/rateLimit';
import { prisma } from './prisma/client';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';
import type { AuthUser, GraphQLContext } from './types';

const app = fastify({ logger: true });

const buildContext = async (
  request: GraphQLContext['request'],
  reply: GraphQLContext['reply'],
): Promise<GraphQLContext> => {
  let user: AuthUser | null = null;
  if (request.headers.authorization) {
    const payload = await request.jwtVerify();
    user = { id: payload.sub, email: payload.email };
  }
  return { request, reply, prisma, user };
};

const start = async () => {
  await registerCors(app);
  await registerRateLimit(app);
  await registerAuth(app);

  await app.register(mercurius, {
    schema: typeDefs,
    resolvers,
    context: buildContext,
    graphiql: env.NODE_ENV !== 'production',
  });

  app.get('/health', async () => ({ status: 'ok' }));

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
};

start().catch((error) => {
  app.log.error(error, 'Failed to start server');
  process.exitCode = 1;
});
