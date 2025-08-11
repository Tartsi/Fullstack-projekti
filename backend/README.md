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

## Environment Variables

Create a file named **`.env`** inside `backend/` with the following content. Replace placeholders with values from Neon’s dashboard.

```ini
# Runtime
NODE_ENV=development
PORT=4000

# Frontend origins allowed by CORS (comma-separated)
# In development Vite uses http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Database URLs from Neon
DATABASE_URL="postgresql://<user>:<password>@<pooled-host>/<db>?sslmode=require&pgbouncer=true&connect_timeout=10&connection_limit=1"

PRISMA_MIGRATION_URL="postgresql://<user>:<password>@<direct-host>/<db>?sslmode=require&connect_timeout=10"

# Session secret: a long random string (at least 32 characters)
SESSION_SECRET="your_random_secret"
```

**Why two URLs?**

* **Application (DATABASE\_URL)** uses Neon’s connection pooler (PgBouncer) to keep connections low and stable.
* **Migrations (PRISMA\_MIGRATION\_URL)** use a direct connection which is more reliable for schema changes.

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