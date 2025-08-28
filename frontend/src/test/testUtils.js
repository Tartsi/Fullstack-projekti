import { server } from "./mocks/server.js";
import { http, HttpResponse } from "msw";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * MSW test utilities for easier test setup
 */

export const mockSuccessfulLogin = (
  userData = { email: "test@example.com", fullName: "Test User" }
) => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/login`, () => {
      return HttpResponse.json({
        message: "Login successful",
        user: {
          id: "1",
          ...userData,
        },
      });
    })
  );
};

export const mockFailedLogin = (errorMessage = "Invalid credentials") => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/login`, () => {
      return HttpResponse.json({ message: errorMessage }, { status: 401 });
    })
  );
};

export const mockSuccessfulRegistration = (
  userData = { email: "test@example.com", fullName: "Test User" }
) => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/register`, () => {
      return HttpResponse.json({
        message: "User registered successfully",
        user: {
          id: "1",
          ...userData,
        },
      });
    })
  );
};

export const mockFailedRegistration = (
  errorMessage = "Email already exists"
) => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/register`, () => {
      return HttpResponse.json({ message: errorMessage }, { status: 400 });
    })
  );
};

export const mockSuccessfulPasswordReset = () => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/forgot-password`, () => {
      return HttpResponse.json({
        message: "Password reset email sent",
      });
    })
  );
};

export const mockFailedPasswordReset = (errorMessage = "Email is required") => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/forgot-password`, () => {
      return HttpResponse.json({ message: errorMessage }, { status: 400 });
    })
  );
};

export const mockSuccessfulLogout = () => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/logout`, () => {
      return HttpResponse.json({
        message: "Logout successful",
      });
    })
  );
};

export const mockFailedLogout = (errorMessage = "Logout failed") => {
  server.use(
    http.post(`${API_BASE_URL}/api/users/logout`, () => {
      return HttpResponse.json({ message: errorMessage }, { status: 500 });
    })
  );
};

export const mockAuthenticatedUser = (
  userData = { email: "test@example.com", fullName: "Test User" }
) => {
  server.use(
    http.get(`${API_BASE_URL}/api/users/me`, () => {
      return HttpResponse.json({
        user: {
          id: "1",
          ...userData,
        },
      });
    })
  );
};

export const mockUnauthenticatedUser = () => {
  server.use(
    http.get(`${API_BASE_URL}/api/users/me`, () => {
      return HttpResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    })
  );
};

export const mockNetworkError = (url, method = "get") => {
  const httpMethod = http[method.toLowerCase()];
  server.use(
    httpMethod(url, () => {
      return HttpResponse.error();
    })
  );
};
