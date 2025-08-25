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
 * NOTE: This function should only be called when you actually need to verify auth status,
 * not automatically on app startup
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/users/me");

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
    // Handle 401 silently - it's normal when user isn't authenticated
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

export default {
  checkBackendHealth,
  registerUser,
  loginUser,
  requestPasswordReset,
  logoutUser,
  getCurrentUser,
};
