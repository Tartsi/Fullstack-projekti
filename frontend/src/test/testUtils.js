import { server } from "./mocks/server.js";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * MSW test utilities for easier test setup
 * Currently only exports server for basic mock setup
 */

export { server, API_BASE_URL };
