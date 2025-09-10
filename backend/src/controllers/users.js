import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { authLogger, requireAuth } from "../utils/middleware.js";
import { sanitizeString } from "../utils/sanitization.js";

const router = Router();
// Default prisma instance, can be overridden for testing
let prisma = new PrismaClient();

// Function to set custom prisma instance (for testing)
export const setPrismaInstance = (customPrisma) => {
  prisma = customPrisma;
};

// Rate limiter for registration endpoint to prevent abuse
const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 registration requests per windowMs
  message: {
    ok: false,
    message: "Too many registration attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests in count
  skipSuccessfulRequests: true,
  // Skip failed requests (validation errors, etc.) in count to prevent lockout on typos
  skipFailedRequests: false,
});

// Rate limiter for login endpoint to prevent brute force attacks
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    ok: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Rate limiter for user deletion to prevent abuse
const deleteUserRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // Limit each IP to 3 deletion attempts per windowMs
  message: {
    ok: false,
    message: "Too many deletion attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Rate limiter for password reset to prevent abuse
const resetPasswordRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 reset attempts per windowMs
  message: {
    ok: false,
    message: "Too many password reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Validation schemas with sanitization
const registerSchema = z.object({
  email: z.string().email().transform(sanitizeString),
  password: z.string().min(6).transform(sanitizeString),
  fullName: z.string().min(1).max(100).transform(sanitizeString),
});

const loginSchema = z.object({
  email: z.string().email().transform(sanitizeString),
  password: z.string().min(1).transform(sanitizeString),
});

const resetPasswordSchema = z.object({
  email: z.string().email().transform(sanitizeString),
});

const deleteUserSchema = z.object({
  password: z.string().min(1).transform(sanitizeString),
});

// Registration endpoint
export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, fullName } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      authLogger.loginFailure(email, req.ip, "User already exists");
      return res.status(409).json({
        ok: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    authLogger.registration(email, email, req.ip);

    res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Error occured when registering user",
        errors: error.errors,
      });
    }

    console.error("Registration error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Login endpoint
export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    authLogger.loginAttempt(email, req.ip);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      authLogger.loginFailure(email, req.ip, "Invalid username or password!");
      return res.status(401).json({
        ok: false,
        message: "Invalid username or password!",
      });
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.passwordHash, password);

    if (!isValidPassword) {
      authLogger.loginFailure(email, req.ip, "Invalid username or password!");
      return res.status(401).json({
        ok: false,
        message: "Invalid username or password!",
      });
    }

    // Create session (using express-session)
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;

    authLogger.loginSuccess(email, req.ip);

    res.json({
      ok: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Error occured when trying to login!",
        errors: error.errors,
      });
    }

    console.error("Login error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Password reset request endpoint
export const requestPasswordReset = async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const { email } = validatedData;

    authLogger.loginAttempt(email, req.ip, "Password reset requested");

    // Always send reset instructions for security purposes
    res.json({
      ok: true,
      message: "Password reset instructions sent!",
    });

    // If project goes further:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    // This project will just return success
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email format",
        errors: error.errors,
      });
    }

    console.error("Password reset request error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Logout endpoint
export const logout = async (req, res) => {
  try {
    const email = req.session.email;

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({
          ok: false,
          message: "Could not log out",
        });
      }

      authLogger.logout(email, req.ip);
      res.clearCookie("connect.sid"); // Clear session cookie

      res.json({
        ok: true,
        message: "Logged out successfully",
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Delete user account endpoint
export const deleteUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const email = req.session.email;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Not authenticated",
      });
    }

    // Validate request body
    const validatedData = deleteUserSchema.parse(req.body);
    const { password } = validatedData;

    // Find user to verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.passwordHash, password);

    if (!isValidPassword) {
      authLogger.loginFailure(
        email,
        req.ip,
        "Invalid password for account deletion"
      );
      return res.status(401).json({
        ok: false,
        message: "Invalid password",
      });
    }

    // Delete user and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // First, delete all bookings for this user
      await tx.booking.deleteMany({
        where: { userId: userId },
      });

      // Then delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error after user deletion:", err);
      }
    });

    authLogger.userDeleted(email, req.ip);

    res.clearCookie("connect.sid"); // Clear session cookie

    res.json({
      ok: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Password is required",
        errors: error.errors,
      });
    }

    console.error("Delete user error:", error);
    res.status(500).json({
      ok: false,
      message: `Internal server error when deleting user: ${error}`,
    });
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Routes
router.post("/register", registerRateLimit, register);
router.post("/login", loginRateLimit, login);
router.post("/logout", logout);
router.post("/reset-password", resetPasswordRateLimit, requestPasswordReset);
router.delete("/delete", requireAuth, deleteUserRateLimit, deleteUser);
router.get("/info", requireAuth, getCurrentUser);

export default router;
