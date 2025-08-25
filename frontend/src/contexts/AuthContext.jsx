import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../services/users";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Login function - called after successful login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Optional function to check authentication status
  const checkAuthStatus = async () => {
    if (isCheckingAuth) return; // Prevent multiple simultaneous checks

    try {
      setIsCheckingAuth(true);
      const result = await getCurrentUser();

      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      // Silently handle errors - user is simply not authenticated
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout endpoint
      await logoutUser();
    } catch (error) {
      // Even if backend call fails, clear local state
      console.error("Backend logout failed, but clearing local state:", error);
    } finally {
      // Always clear local authentication state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Clear authentication state (for errors, expired sessions, etc.)
  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    clearAuth,
    checkAuthStatus, // Only use when you really need to verify auth status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
