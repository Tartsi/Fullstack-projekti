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
    // For now, just return success without backend connection
    // This will be connected to backend later
    console.log("Registration attempt for:", userData.email);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    console.error("User registration failed:", error);

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
    // For now, just return success without backend connection
    // This will be connected to backend later
    console.log("Login attempt for:", loginData.email);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    console.error("User login failed:", error);

    return {
      success: false,
      message: "Login failed. Please check your credentials.",
    };
  }
};

export default {
  checkBackendHealth,
  registerUser,
  loginUser,
};
