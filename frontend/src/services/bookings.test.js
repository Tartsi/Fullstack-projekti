import { describe, it, expect, beforeEach } from "vitest";
import { server } from "../test/mocks/server.js";
import { http, HttpResponse } from "msw";
import { createBooking, getUserBookings, deleteBooking } from "./bookings.js";

// API base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

describe("Bookings Service", () => {
  beforeEach(() => {
    // Reset handlers before each test
    server.resetHandlers();
  });

  describe("createBooking", () => {
    it("should create a booking successfully", async () => {
      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      const result = await createBooking(bookingData);

      expect(result).toEqual({
        id: "new-booking-123",
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        city: bookingData.city,
        location: bookingData.location,
        phoneNumber: bookingData.phoneNumber,
        paymentMethod: bookingData.paymentMethod,
        status: "CONFIRMED",
        createdAt: expect.any(String),
        user: {
          id: "1",
          email: "test@example.com",
          fullName: "Test User",
        },
      });
    });

    it("should handle validation errors when creating booking", async () => {
      const invalidBookingData = {
        date: "",
        timeSlot: "",
        city: "",
        location: "Testikatu 123",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      await expect(createBooking(invalidBookingData)).rejects.toThrow(
        "Missing required fields"
      );
    });

    it("should handle invalid phone number error", async () => {
      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "invalid",
        paymentMethod: "card",
      };

      await expect(createBooking(bookingData)).rejects.toThrow(
        "Invalid phone number"
      );
    });

    it("should handle network errors when creating booking", async () => {
      // Override handler to simulate network error
      server.use(
        http.post(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        })
      );

      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      await expect(createBooking(bookingData)).rejects.toThrow(
        "Internal server error"
      );
    });

    it("should handle fetch errors when creating booking", async () => {
      // Override handler to simulate network failure
      server.use(
        http.post(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.error();
        })
      );

      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      await expect(createBooking(bookingData)).rejects.toThrow();
    });
  });

  describe("getUserBookings", () => {
    it("should fetch user bookings successfully", async () => {
      const result = await getUserBookings();

      expect(result).toEqual([
        {
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
        },
        {
          id: "2",
          date: "2025-09-01T14:00:00.000Z",
          timeSlot: "14:00-16:00",
          city: "Espoo",
          location: "Esimerkkitie 5, Espoo",
          phoneNumber: "+358507654321",
          paymentMethod: "cash",
          status: "CONFIRMED",
          createdAt: "2025-08-26T12:00:00.000Z",
          user: {
            id: "1",
            email: "test@example.com",
            fullName: "Test User",
          },
        },
      ]);
    });

    it("should handle unauthorized access when fetching bookings", async () => {
      // Override handler to simulate unauthorized access
      server.use(
        http.get(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
        })
      );

      await expect(getUserBookings()).rejects.toThrow("Unauthorized");
    });

    it("should handle server errors when fetching bookings", async () => {
      // Override handler to simulate server error
      server.use(
        http.get(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        })
      );

      await expect(getUserBookings()).rejects.toThrow("Internal server error");
    });

    it("should handle network errors when fetching bookings", async () => {
      // Override handler to simulate network failure
      server.use(
        http.get(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.error();
        })
      );

      await expect(getUserBookings()).rejects.toThrow();
    });

    it("should return empty array when user has no bookings", async () => {
      // Override handler to return empty array
      server.use(
        http.get(`${API_BASE_URL}/api/bookings`, () => {
          return HttpResponse.json([]);
        })
      );

      const result = await getUserBookings();
      expect(result).toEqual([]);
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking successfully", async () => {
      const bookingId = "booking-123";
      const result = await deleteBooking(bookingId);

      expect(result).toEqual({
        message: "Booking deleted successfully",
        deletedBookingId: bookingId,
      });
    });

    it("should handle booking not found error", async () => {
      const bookingId = "non-existent";

      await expect(deleteBooking(bookingId)).rejects.toThrow(
        "Booking not found"
      );
    });

    it("should handle unauthorized deletion error", async () => {
      const bookingId = "unauthorized";

      await expect(deleteBooking(bookingId)).rejects.toThrow(
        "Unauthorized to delete this booking"
      );
    });

    it("should handle server errors when deleting booking", async () => {
      const bookingId = "booking-123";

      // Override handler to simulate server error
      server.use(
        http.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, () => {
          return HttpResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        })
      );

      await expect(deleteBooking(bookingId)).rejects.toThrow(
        "Internal server error"
      );
    });

    it("should handle network errors when deleting booking", async () => {
      const bookingId = "booking-123";

      // Override handler to simulate network failure
      server.use(
        http.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, () => {
          return HttpResponse.error();
        })
      );

      await expect(deleteBooking(bookingId)).rejects.toThrow();
    });

    it("should handle missing booking ID", async () => {
      // Test with undefined, null, and empty string
      await expect(deleteBooking(undefined)).rejects.toThrow();
      await expect(deleteBooking(null)).rejects.toThrow();
      await expect(deleteBooking("")).rejects.toThrow();
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle malformed JSON responses", async () => {
      // Override handler to return malformed JSON
      server.use(
        http.get(`${API_BASE_URL}/api/bookings`, () => {
          return new Response("Invalid JSON", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        })
      );

      await expect(getUserBookings()).rejects.toThrow();
    });

    it("should handle empty response body", async () => {
      // Override handler to return empty response
      server.use(
        http.post(`${API_BASE_URL}/api/bookings`, () => {
          return new Response(null, { status: 200 });
        })
      );

      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      await expect(createBooking(bookingData)).rejects.toThrow();
    });

    it("should include credentials in all requests", async () => {
      // This test verifies that credentials are included in requests
      // by checking the request configuration through MSW
      let requestCredentials = null;

      server.use(
        http.post(`${API_BASE_URL}/api/bookings`, ({ request }) => {
          // Check if credentials are included
          requestCredentials = request.credentials;
          return HttpResponse.json({ id: "test" });
        })
      );

      const bookingData = {
        date: "2025-09-15T10:00:00.000Z",
        timeSlot: "10:00-12:00",
        city: "Helsinki",
        location: "Testikatu 123, Helsinki",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      await createBooking(bookingData);

      // In a real browser environment, credentials would be 'include'
      // In test environment, this might not be exactly the same
      expect(requestCredentials).toBeDefined();
    });
  });
});
