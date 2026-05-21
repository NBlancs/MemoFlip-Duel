"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mercurius_1 = __importDefault(require("mercurius"));
const env_1 = require("./config/env");
const auth_1 = require("./plugins/auth");
const cors_1 = require("./plugins/cors");
const rateLimit_1 = require("./plugins/rateLimit");
const client_1 = require("./prisma/client");
const resolvers_1 = require("./resolvers");
const schema_1 = require("./schema");
const app = (0, fastify_1.default)({ logger: true });
const buildContext = async (request, reply) => {
    let user = null;
    if (request.headers.authorization) {
        const payload = (await request.jwtVerify());
        user = { id: payload.sub, email: payload.email };
    }
    return { request, reply, prisma: client_1.prisma, user };
};
const start = async () => {
    await (0, cors_1.registerCors)(app);
    await (0, rateLimit_1.registerRateLimit)(app);
    await (0, auth_1.registerAuth)(app);
    await app.register(mercurius_1.default, {
        schema: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        context: buildContext,
        graphiql: env_1.env.NODE_ENV !== 'production',
    });
    app.get('/', async () => ({
        name: 'MemoFlip Duel API',
        status: 'ok',
        graphql: '/graphql',
        health: '/health',
    }));
    app.get('/health', async () => ({ status: 'ok' }));
    await app.listen({ port: env_1.env.PORT, host: '0.0.0.0' });
};
start().catch((error) => {
    app.log.error(error, 'Failed to start server');
    process.exitCode = 1;
});
