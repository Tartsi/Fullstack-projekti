import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../utils/middleware.js";
import { sanitizeString } from "../utils/sanitization.js";

const router = express.Router();
let prisma = new PrismaClient();

// For testing: allow setting a custom Prisma instance
export const setPrismaInstance = (customPrisma) => {
  prisma = customPrisma;
};

// Apply authentication middleware to all booking routes
router.use(requireAuth);

/**
 * POST /api/bookings
 * Create a new booking for authenticated user
 *
 * @body {string} date - Booking date in ISO format
 * @body {string} timeSlot - Selected time slot
 * @body {string} city - Selected city
 * @body {string} address - Customer address
 * @body {string} phoneNumber - Customer phone number
 * @body {string} paymentMethod - Selected payment method
 *
 * @returns {Object} Created booking with details
 */
router.post("/", async (req, res) => {
  try {
    // Sanitize all input fields
    const {
      date,
      timeSlot: rawTimeSlot,
      city: rawCity,
      address: rawAddress,
      phoneNumber: rawPhoneNumber,
      paymentMethod: rawPaymentMethod,
    } = req.body;

    // Sanitize string inputs
    const timeSlot = sanitizeString(rawTimeSlot);
    const city = sanitizeString(rawCity);
    const address = sanitizeString(rawAddress);
    const phoneNumber = sanitizeString(rawPhoneNumber);
    const paymentMethod = sanitizeString(rawPaymentMethod);

    const userId = req.user?.id;

    // Validate required fields
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (
      !date ||
      !timeSlot ||
      !city ||
      !address ||
      !phoneNumber ||
      !paymentMethod
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "date",
          "timeSlot",
          "city",
          "address",
          "phoneNumber",
          "paymentMethod",
        ],
      });
    }

    // Validate date format and ensure it's in the future
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (bookingDate <= new Date()) {
      return res
        .status(400)
        .json({ error: "Booking date must be in the future" });
    }

    //

    // Create location string combining city and address and capitalize first letter of the city
    const location = `${address}, ${city.replace(/^./, (match) =>
      match.toUpperCase()
    )}`;

    // Create the booking in database
    const booking = await prisma.booking.create({
      data: {
        userId,
        date: bookingDate,
        timeSlot,
        location,
        status: "CONFIRMED",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    // Return booking details with additional info for frontend
    const bookingResponse = {
      id: booking.id,
      date: booking.date,
      timeSlot: booking.timeSlot,
      location: booking.location,
      status: booking.status,
      createdAt: booking.createdAt,
      user: booking.user,
      // Include the additional details that were submitted but not stored in DB
      bookingDetails: {
        city,
        address,
        phoneNumber,
        paymentMethod,
      },
    };

    res.status(201).json(bookingResponse);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/bookings
 * Get all bookings for authenticated user
 *
 * @returns {Array} Array of user's bookings
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/bookings/:id
 * Delete a booking completely for an authenticated user
 *
 * @param {string} id - Booking ID
 * @returns {Object} Delete confirmation
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete the booking completely
    await prisma.booking.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Booking deleted successfully",
      deletedBookingId: id,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
