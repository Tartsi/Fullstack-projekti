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

  // Create booking
  http.post(`${API_BASE_URL}/api/bookings`, async ({ request }) => {
    const bookingData = await request.json();

    // Simulate validation errors
    if (!bookingData.date || !bookingData.timeSlot || !bookingData.city) {
      return HttpResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (bookingData.phoneNumber === "invalid") {
      return HttpResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Simulate successful booking creation
    return HttpResponse.json({
      id: "new-booking-123",
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      city: bookingData.city,
      location: bookingData.location,
      phoneNumber: bookingData.phoneNumber,
      paymentMethod: bookingData.paymentMethod,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      user: {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
      },
    });
  }),

  // Get user bookings
  http.get(`${API_BASE_URL}/api/bookings`, () => {
    // Simulate user bookings
    return HttpResponse.json([
      {
        id: "1",
        date: "2025-08-30T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 1, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
        status: "CONFIRMED",
        createdAt: "2025-08-25T12:00:00.000Z",
        user: {
          id: "1",
          email: "test@example.com",
          fullName: "Test User",
        },
      },
      {
        id: "2",
        date: "2025-09-01T14:00:00.000Z",
        timeSlot: "14:00-16:00",
        city: "Espoo",
        location: "Esimerkkitie 5, Espoo",
        phoneNumber: "+358507654321",
        paymentMethod: "cash",
        status: "CONFIRMED",
        createdAt: "2025-08-26T12:00:00.000Z",
        user: {
          id: "1",
          email: "test@example.com",
          fullName: "Test User",
        },
      },
    ]);
  }),

  // Delete booking
  http.delete(`${API_BASE_URL}/api/bookings/:id`, ({ params }) => {
    const { id } = params;

    // Handle missing or invalid booking IDs
    if (!id || id === "undefined" || id === "null" || id === "") {
      return HttpResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    if (id === "non-existent") {
      return HttpResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (id === "unauthorized") {
      return HttpResponse.json(
        { error: "Unauthorized to delete this booking" },
        { status: 403 }
      );
    }

    // Simulate successful deletion
    return HttpResponse.json({
      message: "Booking deleted successfully",
      deletedBookingId: id,
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

  http.delete("*", ({ request }) => {
    console.warn(`Unhandled DELETE request: ${request.url}`);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];
