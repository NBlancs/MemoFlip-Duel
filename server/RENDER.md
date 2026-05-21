Deploying the MemoFlip server to Render
======================================

This document outlines a straightforward way to deploy the server to Render as a Web Service and what environment variables to set.

1) Create a Postgres database on Render
   - In the Render dashboard create a new "Postgres" managed database.
   - Note the connection string (DATABASE_URL) and keep it handy.

2) Create a new Web Service on Render
   - Connect your GitHub repo that contains this project.
   - Choose the `server/` directory as the Root Directory for the service.
   - Set the Build Command to:

     npm ci && npm run prisma:generate && npm run build

     (Prisma requires `prisma generate` to create the client before build/run.)

   - Set the Start Command to:

     npm start

   - Set the Environment to `Node` and choose a compatible Node version (Render default is usually fine).

3) Add Environment Variables
   - In the Render service settings -> Environment, add the following variables (from `server/.env.example`):
     - `DATABASE_URL` (the Postgres connection string from step 1)
     - `JWT_SECRET` (a strong secret string, at least 16+ characters)
     - Optionally set `NODE_ENV=production` and `PORT` if you want custom port (Render provides `PORT` automatically).

4) (Optional) Run Prisma migrations and seed
   - You can run `npx prisma migrate deploy` on Render as a one-time deploy hook, or run migrations locally against the Render DB.
   - To seed data: use `npm run seed` after ensuring `DATABASE_URL` is set.

5) Health check and security
   - Confirm the service is healthy using the Render service URL: `https://<your-service>.onrender.com/health` (if your server exposes a health endpoint).
   - Make sure your firewall/security groups allow connections only where required and your DB is not publicly exposed beyond Render's internal network.

Tips
----
- Use HTTPS for your public API (Render provides HTTPS by default).
- Use Render's Environment secrets rather than committing credentials to the repo.
- If you want automatic deploys from `main`/`master`, enable auto-deploy in the service settings.
