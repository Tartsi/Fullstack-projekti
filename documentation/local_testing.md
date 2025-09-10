# Local Testing Guide

## Prerequisites

- Node.js **v20**
- Git installed
- Neon database account: [https://neon.tech](https://neon.tech) (free tier is enough)
- Optional: Postman or REST-requests (provided in the code) for testing


## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/Tartsi/Fullstack-projekti

# Navigate to Root Directory
../Fullstack-projekti

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a free account
3. Create a new project
4. Create **two databases**:
   - `development` (for development)
   - `test` (for running tests)

### 3. Get Database URLs

From your Neon dashboard, copy the connection strings:

- **Pooled connection** (for DATABASE_URL and TEST_DATABASE_URL)
- **Direct connection** (for PRISMA_MIGRATION_URL and TEST_PRISMA_MIGRATION_URL)

### 4. Backend Configuration

Create `backend/.env` file:

Edit `backend/.env` with your Neon URLs:

```bash
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Main database (use your main db connection strings)
DATABASE_URL="postgresql://user:password@host/main?sslmode=require&pgbouncer=true"
PRISMA_MIGRATION_URL="postgresql://user:password@direct-host/main?sslmode=require"

# Test database (use your test db connection strings)
TEST_DATABASE_URL="postgresql://user:password@host/test?sslmode=require&pgbouncer=true"
TEST_PRISMA_MIGRATION_URL="postgresql://user:password@direct-host/test?sslmode=require"

SESSION_SECRET="your_random_32_character_secret_key_here"
```

### 5. Frontend Configuration

Create `frontend/.env` file:

Content should be:

```bash
# Use your local backend server
VITE_API_BASE_URL=http://localhost:4000
```

### 6. Database Migration

```bash
cd backend

# Generate Prisma client
npm run prisma:gen

# Run migrations once on development database
npm run migrate:deploy

# If you want to run backend tests on a separate test database MIGRATE that one too!
# Do this by going to schema.prisma-file located in backend/prisma and change the url and directUrl
# to env("TEST_DATABASE_URL") and env("TEST_PRISMA_MIGRATION_URL) and now repeat the above process
# After migrations have ran, change them back to the original URLs.
```

### 7. Run Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Application will be available at `http://localhost:5173`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Troubleshooting

- **Database connection errors**: Verify your Neon URLs are correct
- **Migration errors**: Ensure test database exists and URLs point to different databases
- **CORS errors**: Check that CORS_ORIGIN matches your frontend URL
- **Session errors**: Generate a strong SESSION_SECRET (32+ characters)

## Notes

- Backend runs on port 4000
- Frontend runs on port 5173
- Tests use separate test database to avoid conflicts
- Environment files are gitignored for security

