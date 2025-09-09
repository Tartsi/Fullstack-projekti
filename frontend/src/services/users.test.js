import { describe, it, expect, beforeEach } from "vitest";
import { server } from "../test/mocks/server.js";
import { http, HttpResponse } from "msw";
import {
  checkBackendHealth,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  requestPasswordReset,
  deleteUser,
  getUserBookings,
} from "./users.js";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

describe("Users Service", () => {
  beforeEach(() => {
    // Reset handlers before each test
    server.resetHandlers();
  });

  describe("checkBackendHealth", () => {
    it("should return success when backend is healthy", async () => {
      const result = await checkBackendHealth();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Backend health check passed!");
      expect(result.data).toEqual({
        status: "healthy",
        message: "Backend is running",
        timestamp: expect.any(String),
      });
    });

    it("should handle health check failure", async () => {
      // Override handler to simulate failure
      server.use(
        http.get(`${API_BASE_URL}/healthz`, () => {
          return HttpResponse.json(
            { error: "Service unavailable" },
            { status: 503 }
          );
        })
      );

      const result = await checkBackendHealth();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Backend health check failed");
      expect(result.error).toBeDefined();
    });
  });

  describe("registerUser", () => {
    it("should register user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };

      const result = await registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("User registered successfully");
      expect(result.user).toEqual({
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
      });
    });

    it("should handle registration with missing fields", async () => {
      const userData = {
        email: "",
        password: "password123",
        fullName: "Test User",
      };

      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("All fields are required");
    });

    it("should handle duplicate email registration", async () => {
      const userData = {
        email: "existing@example.com",
        password: "password123",
        fullName: "Test User",
      };

      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email already exists");
    });
  });

  describe("loginUser", () => {
    it("should login user successfully with correct credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful");
      expect(result.user).toEqual({
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
      });
    });

    it("should handle invalid credentials", async () => {
      const loginData = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should handle login with missing fields", async () => {
      const loginData = {
        email: "",
        password: "password123",
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email and password are required");
    });
  });

  describe("logoutUser", () => {
    it("should logout user successfully", async () => {
      const result = await logoutUser();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Logout successful");
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      // Override handler to simulate authenticated user with session
      server.use(
        http.get(`${API_BASE_URL}/api/users/info`, () => {
          return HttpResponse.json({
            ok: true,
            user: {
              id: "1",
              email: "test@example.com",
              fullName: "Test User",
            },
          });
        })
      );

      const result = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
      });
    });

    it("should handle unauthenticated user", async () => {
      // Override the user info handler to return unauthenticated response
      server.use(
        http.get(`${API_BASE_URL}/api/users/info`, () => {
          return HttpResponse.json(
            { ok: false, message: "Not authenticated" },
            { status: 401 }
          );
        })
      );

      const result = await getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authenticated");
    });
  });

  describe("requestPasswordReset", () => {
    it("should request password reset successfully", async () => {
      const result = await requestPasswordReset({ email: "test@example.com" });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Password reset email sent");
    });

    it("should handle password reset with missing email", async () => {
      const result = await requestPasswordReset({ email: "" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email is required");
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const result = await deleteUser({ password: "correctpassword" });

      expect(result.success).toBe(true);
      expect(result.message).toBe("User deleted successfully");
    });

    it("should handle invalid password", async () => {
      const result = await deleteUser({ password: "wrongpassword" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid password");
    });
  });

  describe("getUserBookings", () => {
    it("should get user bookings successfully", async () => {
      const result = await getUserBookings();

      expect(result.success).toBe(true);
      expect(result.bookings).toHaveLength(2);
      expect(result.bookings[0]).toEqual({
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
      });
    });
  });
});
