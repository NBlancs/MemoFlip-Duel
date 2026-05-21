# MemoFlip

> MemoFlip — a React Native + server single-player memory card game.

This repository contains two main parts:
- `client/` — React Native (Expo) app for the game UI.
- `server/` — Fastify + Prisma backend providing GraphQL/resolvers and game backend logic and APIs.

## Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- For the mobile app: Expo CLI (optional but recommended)
- For the server DB: PostgreSQL (or a compatible database) for Prisma migrations

## Quick start

Client (mobile app)

```bash
cd client
npm install
# start Expo dev server
npx expo start
```

Server (backend)

```bash
cd server
npm install
# check scripts in package.json and run the dev script (e.g. `npm run dev`)
npm run dev
```

Database / Prisma

Prisma schema and migrations live in `server/prisma/`. To run migrations locally:

```bash
cd server
npx prisma migrate dev
# optionally seed the database (see server/prisma/seed.ts)
node prisma/seed.ts
```

## Configuration
- Environment variables for server are in `server/config/env.ts` and referenced from [server/package.json](server/package.json).
- For the client, update any backend URLs in the app config or environment files to point to your local server (use LAN URL when testing on a device).

## Tests
- Client tests are under `client/src/__tests__/`.
- Server tests (if present) live under `server/`.

## Contributing
- Fork, create a feature branch, implement changes, then open a PR.

## License
Specify a license for the project here, or add a `LICENSE` file.

---
If you'd like, I can also commit the new `README.md` and open a PR. What would you like me to do next?
