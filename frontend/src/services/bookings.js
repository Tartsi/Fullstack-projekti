/**
 * Booking service for handling booking-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "GET",
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
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      method: "DELETE",
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
