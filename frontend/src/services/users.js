import axios from "axios";

// Configure axios defaults
// In production, the frontend and backend are served from the same domain
// In development, we use the environment variable or localhost:4000
const API_BASE_URL = import.meta.env.PROD
  ? "" // Use same origin in production
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cookies for session management
});

// CSRF token management
let csrfToken = null;
let csrfRequired = null; // Cache whether CSRF is required

/**
 * Check if CSRF token is required by examining the token from backend
 */
const checkCsrfRequired = async () => {
  if (csrfRequired !== null) return csrfRequired;

  try {
    const response = await apiClient.get("/api/csrf-token");
    const token = response.data.csrfToken;
    // If we get a real token (not dev-mode dummy), CSRF is required
    csrfRequired = token !== "dev-mode-no-csrf";
    csrfToken = token;
    return csrfRequired;
  } catch (error) {
    console.error("Failed to check CSRF requirement:", error);
    csrfRequired = false;
    return false;
  }
};

/**
 * Get CSRF token from backend
 */
const getCsrfToken = async () => {
  try {
    const response = await apiClient.get("/api/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
};

/**
 * Force refresh CSRF token (useful after logout or session issues)
 */
const refreshCsrfToken = async () => {
  csrfToken = null;
  csrfRequired = null; // Reset the cache
  await checkCsrfRequired(); // This will fetch new token and update cache
  return csrfToken;
};

// Request interceptor to add CSRF token to headers
apiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token to non-GET requests if required by backend
    if (config.method !== "get") {
      const isRequired = await checkCsrfRequired();
      if (isRequired) {
        if (!csrfToken) {
          await getCsrfToken();
        }
        if (csrfToken && csrfToken !== "dev-mode-no-csrf") {
          config.headers["X-CSRF-Token"] = csrfToken;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF token errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Prevent infinite retry loops
    if (error.config._csrfRetryCount) {
      console.log("CSRF retry already attempted, giving up");
      return Promise.reject(error);
    }

    // If CSRF token is invalid or mismatch, try to get a new one and retry
    if (
      error.response?.status === 403 &&
      (error.response?.data?.message?.includes("CSRF") ||
        error.response?.data?.error?.includes("CSRF") ||
        error.message?.includes("CSRF") ||
        error.response?.statusText?.includes("CSRF"))
    ) {
      console.log("CSRF error detected, refreshing token...", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.error,
        statusText: error.response?.statusText,
      });

      // Force refresh token and cache
      await refreshCsrfToken();

      // Only retry if we got a valid CSRF token
      if (csrfToken && csrfToken !== "dev-mode-no-csrf") {
        error.config.headers["X-CSRF-Token"] = csrfToken;
        error.config._csrfRetryCount = 1; // Mark as retried
        console.log("Retrying request with new CSRF token");
        return apiClient.request(error.config);
      } else {
        console.error("Failed to get valid CSRF token for retry");
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Check backend health status
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get("/healthz");

    return {
      success: true,
      message: "Backend health check passed!",
      data: response.data,
    };
  } catch (error) {
    console.error("Backend health check failed:", error);

    return {
      success: false,
      message: "Backend health check failed",
      error: error,
    };
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.fullName - Full name
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/users/register", userData);

    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("User registration failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
};

/**
 * Login user
 * @param {Object} loginData - User login data
 * @param {string} loginData.email - Email address
 * @param {string} loginData.password - Password
 */
export const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post("/api/users/login", loginData);

    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("User login failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Login failed. Please check your credentials.",
    };
  }
};

/**
 * Request password reset
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.email - Email address
 */
export const requestPasswordReset = async (resetData) => {
  try {
    const response = await apiClient.post(
      "/api/users/reset-password",
      resetData
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("Password reset request failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Password reset request failed. Please try again.",
    };
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/api/users/logout");

    // Force refresh CSRF token after logout
    await refreshCsrfToken();

    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("User logout failed:", error);

    // Force refresh CSRF token even if logout failed
    await refreshCsrfToken();

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Logout failed. Please try again.",
    };
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/users/info");

    if (response.data.ok) {
      return {
        success: true,
        user: response.data.user,
      };
    } else if (response.data.status === 401) {
      return {
        success: true,
        user: null,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    // Handle 401 silently
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Not authenticated",
        notAuthenticated: true,
      };
    }

    // Log other errors
    console.error("Get current user failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Failed to get user information.",
    };
  }
};

/**
 * Delete current user account
 * @param {Object} deleteData - User deletion data
 * @param {string} deleteData.password - Password confirmation
 */
export const deleteUser = async (deleteData) => {
  try {
    const response = await apiClient.delete("/api/users/delete", {
      data: { password: deleteData.password },
    });

    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("User deletion failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: "Account deletion failed. Please try again.",
    };
  }
};

/**
 * Get user bookings
 */
export const getUserBookings = async () => {
  try {
    const response = await apiClient.get("/api/bookings");

    // Direct array response from bookings endpoint
    return {
      success: true,
      bookings: response.data,
    };
  } catch (error) {
    // Handle 401 silently
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Not authenticated",
        notAuthenticated: true,
        bookings: [],
      };
    }

    console.error("Get user bookings failed:", error);

    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
        bookings: [],
      };
    }

    return {
      success: false,
      message: "Failed to get bookings.",
      bookings: [],
    };
  }
};

export default {
  checkBackendHealth,
  registerUser,
  loginUser,
  requestPasswordReset,
  logoutUser,
  getCurrentUser,
  deleteUser,
  getUserBookings,
};
