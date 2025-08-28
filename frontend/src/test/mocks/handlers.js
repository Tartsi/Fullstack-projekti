import { http, HttpResponse } from "msw";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const handlers = [
  // Health check endpoint
  http.get(`${API_BASE_URL}/healthz`, () => {
    return HttpResponse.json({
      status: "healthy",
      message: "Backend is running",
      timestamp: new Date().toISOString(),
    });
  }),

  // User registration
  http.post(`${API_BASE_URL}/api/users/register`, async ({ request }) => {
    const userData = await request.json();

    // Simulate validation errors
    if (!userData.email || !userData.password || !userData.fullName) {
      return HttpResponse.json(
        { ok: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (userData.email === "existing@example.com") {
      return HttpResponse.json(
        { ok: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Simulate successful registration
    return HttpResponse.json({
      ok: true,
      message: "User registered successfully",
      user: {
        id: "1",
        email: userData.email,
        fullName: userData.fullName,
      },
    });
  }),

  // User login
  http.post(`${API_BASE_URL}/api/users/login`, async ({ request }) => {
    const credentials = await request.json();

    if (!credentials.email || !credentials.password) {
      return HttpResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simulate invalid credentials
    if (
      credentials.email === "invalid@example.com" ||
      credentials.password === "wrongpassword"
    ) {
      return HttpResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Simulate successful login
    return HttpResponse.json({
      ok: true,
      message: "Login successful",
      user: {
        id: "1",
        email: credentials.email,
        fullName: "Test User",
      },
    });
  }),

  // Password reset request
  http.post(`${API_BASE_URL}/api/users/reset-password`, async ({ request }) => {
    const { email } = await request.json();

    if (!email) {
      return HttpResponse.json(
        { ok: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Simulate successful password reset request
    return HttpResponse.json({
      ok: true,
      message: "Password reset email sent",
    });
  }),

  // User logout
  http.post(`${API_BASE_URL}/api/users/logout`, () => {
    return HttpResponse.json({
      ok: true,
      message: "Logout successful",
    });
  }),

  // Get current user
  http.get(`${API_BASE_URL}/api/users/info`, () => {
    // For tests, always return a valid user if no specific override is set
    return HttpResponse.json({
      ok: true,
      user: {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        createdAt: "2024-02-01T00:00:00.000Z",
      },
    });
  }),

  // Delete user
  http.delete(`${API_BASE_URL}/api/users/delete`, async ({ request }) => {
    const data = await request.json();

    if (data.password === "wrongpassword") {
      return HttpResponse.json(
        { ok: false, message: "Invalid password" },
        { status: 403 }
      );
    }

    return HttpResponse.json({
      ok: true,
      message: "User deleted successfully",
    });
  }),

  // Get user bookings
  http.get(`${API_BASE_URL}/api/users/bookings`, () => {
    // Simulate user bookings
    return HttpResponse.json({
      ok: true,
      bookings: [
        {
          id: "1",
          date: "2025-08-30",
          time: "10:00",
          service: "Car Wash",
          status: "confirmed",
        },
        {
          id: "2",
          date: "2025-09-01",
          time: "14:00",
          service: "Full Detail",
          status: "pending",
        },
      ],
    });
  }),

  // Fallback handlers for unhandled requests
  http.get("*", ({ request }) => {
    console.warn(`Unhandled GET request: ${request.url}`);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post("*", ({ request }) => {
    console.warn(`Unhandled POST request: ${request.url}`);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.put("*", ({ request }) => {
    console.warn(`Unhandled PUT request: ${request.url}`);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.delete("*", ({ request }) => {
    console.warn(`Unhandled DELETE request: ${request.url}`);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];
