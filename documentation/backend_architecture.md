# Backend Architecture

## Overview

The backend is built with Node.js and Express.js framework. It provides a RESTful API for the booking service and handles user authentication, booking management, and database operations using PostgreSQL through **Neon** and Prisma ORM.

## Technologies

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL (**Neon**) + Prisma ORM
- **Authentication**: Sessions (express-session + connect-pg-simple)
- **Passwords**: Argon2 hashing
- **Validation**: Zod schema validation
- **Logging**: Pino logger
- **Testing**: Vitest + Supertest

## Project Structure

```text
src/
├── index.js              # Main application entry point
├── controllers/          # Route controllers
│   ├── users.js         # User management (registration, login etc...)
│   └── bookings.js      # Booking management (for authenticated users)
├── utils/               # Utility libraries
│   ├── server.js        # Server configuration
│   ├── middleware.js    # Custom middleware
│   ├── session.js       # Session configuration
│   ├── sanitization.js  # Input sanitization
│   └── logger.js        # Logging configuration
└── tests/               # Test files
```

## Database Schema

### User

- `id` (UUID, primary key)
- `email` (unique)
- `passwordHash` (Argon2)
- `fullName`
- `role` (USER/ADMIN) (Only basic Users in current project version)
- `createdAt`, `updatedAt`

### Booking

- `id` (UUID, primary key)
- `userId` (foreign key)
- `date` (DateTime)
- `timeSlot` (String)
- `location` (String)
- `status` (DRAFT/CONFIRMED/CANCELLED)
- `createdAt`

## API Endpoints

### Users (`/api/users`)

- `POST /register` - Registration (rate limited)
- `POST /login` - Login (rate limited)
- `POST /logout` - Logout
- `POST /reset-password` - Password reset (rate limited)
- `POST /delete` - User deletion (rate limited)
- `GET /info` - User information (authenticated)

### Bookings (`/api/bookings`)

- `POST /` - New booking (authenticated)
- `GET /` - User's bookings (authenticated)
- `DELETE /:id` - Delete booking (authenticated)

### Other

- `GET /api/csrf-token` - CSRF token
- `GET /health` - Health check

## Security

- **Helmet.js**: HTTP security headers
- **CORS**: Configurable cross-origin requests
- **Rate limiting**: Registration restrictions
- **Input sanitization**: XSS protection
- **CSRF protection**: Token-based (in production)
- **Session security**: Secure cookies, HttpOnly
- **Password hashing**: Argon2 algorithm

## Middleware Pipeline

1. **Helmet** - Security headers
2. **Request logging** - Pino logger
3. **JSON parsing** - Express built-in
4. **Input sanitization** - Custom XSS protection
5. **Session handling** - PostgreSQL-backed sessions
6. **CORS** - Environment-specific configuration
7. **Route handlers** - Controllers
8. **Error logging** - Pino error logger

## Environment Variables

- `PORT` - Server port (default: 4000)
- `DATABASE_URL` - PostgreSQL connection string
- `TEST_DATABASE_URL` - PostgreSQL connection string for test-branch on your database
- `SESSION_SECRET` - Session secret key
- `CORS_ORIGIN` - Allowed CORS origins
- `NODE_ENV` - Environment (development/production)

## Scalability

- Stateless design (sessions in database)
- Database connection pooling (Prisma)
- Rate limiting for DoS protection
- Health check endpoint
- Docker support
- Successful deployment (Fly)

## Logging

Structured JSON logs with Pino:

- HTTP request monitoring (timing, status)
- Error logging with stack traces
- Authentication tracking
- Development: pretty printing
- Production: JSON format

## Testing

- **Unit tests**: Controllers and utilities
- **Integration tests**: API endpoints
- **Test setup**: Isolated test database
- **Mocking**: Prisma client mocked in tests
