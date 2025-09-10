/**
 * Booking service for handling booking-related API calls
 */

// Configure API base URL consistently with users.js
const API_BASE_URL = import.meta.env.PROD
  ? "" // Use same origin in production
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// CSRF token management
let csrfToken = null;

/**
 * Get CSRF token from backend
 */
const getCsrfToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
      credentials: "include",
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
};

/**
 * Helper function to add CSRF token to headers
 */
const getHeaders = async (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  // Add CSRF token in production
  if (import.meta.env.PROD) {
    if (!csrfToken) {
      await getCsrfToken();
    }
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return headers;
};

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data
 * @param {string} bookingData.date - Booking date in ISO format
 * @param {string} bookingData.timeSlot - Selected time slot
 * @param {string} bookingData.city - Selected city
 * @param {string} bookingData.address - Customer address
 * @param {string} bookingData.phoneNumber - Customer phone number
 * @param {string} bookingData.paymentMethod - Selected payment method
 * @returns {Promise<Object>} The created booking
 */
export const createBooking = async (bookingData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers,
      credentials: "include", // Important for sending session cookies
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Get all bookings for the current user
 * @returns {Promise<Array>} Array of user bookings
 */
export const getUserBookings = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

/**
 * Delete a booking completely
 * @param {string} bookingId - The booking ID to delete
 * @returns {Promise<Object>} The delete confirmation
 */
export const deleteBooking = async (bookingId) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
