# MSW (Mock Service Worker) Testing Setup

This project uses MSW as a development-dependency and as the primary mocking solution for frontend unit tests.

## Why MSW?

- **Network-level interception**: MSW intercepts fetch/XHR-requests in JSDOM and can functions as a 'fake backend' during development and testing
- **Realistic testing**: Tests interact with actual HTTP-requests rather than mocked functions
- **Better isolation**: Each test can override handlers as needed without affecting other tests
- **Development support**: Can be used in dev mode for API mocking when backend is unavailable

## Setup Files

### `src/test/setup.js`
- Configures MSW server for all tests
- Sets up global mocks (IntersectionObserver, etc.)
- Automatically imported by Vitest

### `src/test/mocks/server.js`
- Creates and exports the MSW server instance
- Uses handlers from `handlers.js`

### `src/test/mocks/handlers.js`
- Contains all HTTP-request handlers
- Matches the actual service API endpoints
- Returns properly formatted responses with `ok: true/false` format

## Available Endpoints

- `GET /healthz` - Backend health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `POST /api/users/reset-password` - Password reset request
- `GET /api/users/info` - Get current user
- `DELETE /api/users/delete` - Delete user account
- `GET /api/users/bookings` - Get user bookings
