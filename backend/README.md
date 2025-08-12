# Backend

A minimal, secure-by-default backend for the project. Final version provides session-based authentication (register, login, logout, me), CSRF protection compatible with a SPA frontend, and a PostgreSQL database hosted on **Neon**.

---

## Stack

* **Runtime:** Node.js
* **Web framework:** Express
* **Database:** PostgreSQL (Neon cloud)
* **ORM & migrations:** Prisma
* **Auth:** Session cookie (`express-session` + `connect-pg-simple`)
* **Security:** `helmet`, CSRF (`csurf`), input validation (`zod`), password hashing (`argon2`)
* **Logging:** `pino-http`
* **Testing:** Vitest + Supertest

---

# Local Testing

## Prerequisites

* Node.js **v20**
* Neon account: [https://neon.tech](https://neon.tech) (free tier is enough)
* Optional: Postman or curl for testing

---

## Database Setup (Neon)

1. Sign in to **[https://neon.tech](https://neon.tech)** → **Create Project**.
2. Choose Region closest to you.
3. Copy both connection strings from your Neon-project connect view into .env-file:

   * **Pooled** (for `DATABASE_URL`)
   * **Direct** (for `PRISMA_MIGRATION_URL`)
4. Keep `sslmode=require` in both URLs.

---

## Install Dependencies

From the `backend/` folder:

```bash
npm install
```

---

## Prisma Initialization & Migrations

1. Generate the Prisma client:

   ```bash
   npm run prisma:gen
   ```
2. Run the first migration (creates tables in Neon):

   ```bash
   # Use Direct URL for migrations
   DATABASE_URL="$PRISMA_MIGRATION_URL" npm run migrate:dev -- --name init
   ```
---

## Run the Server (Development)

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:4000/healthz
# Expected: {"ok": true}
```

---

## NPM Scripts

```json
{
  "dev": "node --env-file=.env --watch src/index.js",
  "start": "node --env-file=.env src/index.js",
  "prisma:gen": "prisma generate",
  "migrate:dev": "prisma migrate dev",
  "migrate:deploy": "prisma migrate deploy",
  "test": "vitest"
}
```