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
 * Test the connection to the backend by calling the login endpoint
 */
export const testBackendConnection = async () => {
  try {
    const response = await apiClient.post("/api/login/login", {
      // Send a test payload to match the backend expectation
      test: "frontend-backend-connection-test",
    });

    return {
      success: true,
      message: "Backend connection successful!",
      data: response.data,
    };
  } catch (error) {
    console.error("Backend connection failed:", error);

    let errorMessage = "Failed to connect to backend";

    if (error.response) {
      // Server responded with error status
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server. Is the backend running?";
    } else {
      // Something else happened
      errorMessage = error.message || "Unknown error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: error,
    };
  }
};

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

export default {
  testBackendConnection,
  checkBackendHealth,
};
