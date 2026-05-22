# MemoFlip Duel

MemoFlip Duel is a memory card game built with an Expo React Native client and a Fastify + Prisma backend.

## Project Structure

- `client/` - Expo app for gameplay, onboarding, settings, and local score storage.
- `server/` - Fastify GraphQL API with Prisma models, authentication, match submission, and leaderboard queries.
- `server/prisma/` - Database schema, migrations, and seed data.

## Features

- Timed memory-card gameplay with score calculation.
- Local persistence for settings, player profile, and recent results.
- Server-side player, match, and leaderboard data via Prisma.
- Expo navigation, sounds, haptics, and Android immersive navigation support.

## Prerequisites

- Node.js 18 or newer.
- npm 9+.
- PostgreSQL for local development or a hosted PostgreSQL database for deployment.
- Expo Go or a mobile device/emulator for testing the client.

## Local Setup

Clone the repo, then install dependencies in both apps:

```bash
cd client
npm install

cd ../server
npm install
```

### 1. Configure the server

Create `server/.env` from `server/.env.example` and set the required values:

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/memoflip_duel
JWT_SECRET=replace-with-a-long-random-secret
```

Required server variables:

- `DATABASE_URL` - PostgreSQL connection string.
- `JWT_SECRET` - at least 16 characters.
- `PORT` - optional; defaults to `4000`.
- `NODE_ENV` - optional; defaults to `development`.

### 2. Set up the database

From the `server/` folder:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The seed script creates a demo player and sample match sessions so the leaderboard has initial data.

### 3. Configure the client

The client reads runtime configuration from Expo environment variables. Set the API URL in `client/.env` or your shell before starting Expo:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
EXPO_PUBLIC_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
```

If you run on a physical device, use your machine's LAN address instead of `localhost`.

### 4. Start both apps

Run the server:

```bash
cd server
npm run dev
```

Run the client:

```bash
cd client
npm run start
```

## Available Scripts

### Client

- `npm run start` - start Expo.
- `npm run android` - open the app on Android.
- `npm run ios` - open the app on iOS.
- `npm run web` - start the web build.
- `npm run typecheck` - run TypeScript checks.
- `npm run test` - run Jest tests.

### Server

- `npm run dev` - run the server in watch mode.
- `npm run build` - compile the server TypeScript.
- `npm run start` - start the compiled server.
- `npm run prisma:generate` - generate the Prisma client.
- `npm run prisma:migrate` - create and apply a local migration.
- `npm run prisma:studio` - open Prisma Studio.
- `npm run seed` - seed demo data.

## Database and API

The backend uses Prisma models for players and match sessions. GraphQL exposes authentication, match submission, player stats, and leaderboard queries.

Useful endpoints:

- `GET /health` - server health check.
- `GET /` - service metadata.
- `POST /graphql` - GraphQL API.

## Deployment

### Render

See `server/RENDER.md` for the recommended Render deployment flow. In short:

1. Create a managed PostgreSQL database.
2. Deploy the `server/` folder as a web service.
3. Set `DATABASE_URL` and `JWT_SECRET` in the Render environment.
4. Run Prisma migrations before or during the first deploy.

### Expo / Mobile

For device testing, make sure the client points at a reachable LAN or deployed GraphQL URL. `localhost` only works when the app and server run on the same machine.

## Testing

- Client unit tests live under `client/src/__tests__/`.
- Server validation is covered by Prisma, resolver, and service code in `server/src/`.
- Run `npm run typecheck` in `client/` after UI or service changes.
- Run `npm run build` in `server/` to confirm the backend compiles cleanly.

## Troubleshooting

- If the app starts but cannot reach the backend, confirm the Expo public API URL points to a reachable host.
- If leaderboard data disappears after restart, verify the client is using AsyncStorage and the server database is configured.
- If Prisma fails, confirm `DATABASE_URL` is valid and migrations have been applied.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run the relevant client and server checks.
4. Open a pull request.

