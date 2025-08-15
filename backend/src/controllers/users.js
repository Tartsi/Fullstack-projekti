import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { z } from "zod";
import { authLogger } from "../utils/middleware.js";

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Registration endpoint
export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { username, email, password, fullName } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      authLogger.loginFailure(username, req.ip, "User already exists");
      return res.status(409).json({
        ok: false,
        message: "User with this username or email already exists",
      });
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName: fullName || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    authLogger.registration(username, email, req.ip);

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
    const { username, password } = validatedData;

    authLogger.loginAttempt(username, req.ip);

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      authLogger.loginFailure(username, req.ip, "User not found");
      return res.status(401).json({
        ok: false,
        message: "User not found!",
      });
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.passwordHash, password);

    if (!isValidPassword) {
      authLogger.loginFailure(username, req.ip, "Invalid password");
      return res.status(401).json({
        ok: false,
        message: "Invalid password!",
      });
    }

    // Create session (using express-session)
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    authLogger.loginSuccess(username, req.ip);

    res.json({
      ok: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
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

// Logout endpoint
export const logout = async (req, res) => {
  try {
    const username = req.session.username;

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({
          ok: false,
          message: "Could not log out",
        });
      }

      authLogger.logout(username, req.ip);
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
    const username = req.session.username;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Not authenticated",
      });
    }

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: userId },
    });

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error after user deletion:", err);
      }
    });

    authLogger.userDeleted(username, req.ip);

    res.json({
      ok: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Not authenticated",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
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

// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      ok: false,
      message: "Authentication required",
    });
  }
  next();
};

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", requireAuth, deleteUser);
router.get("/me", requireAuth, getCurrentUser);

export default router;
