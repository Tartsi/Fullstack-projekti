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

export default {
  checkBackendHealth,
};
