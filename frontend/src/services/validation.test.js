import { describe, it, expect } from "vitest";
import {
  validateAuthForm,
  validateField,
  sanitizeInput,
  validateInput,
} from "./validation";

// Mock translation function
const mockT = (key) => {
  const translations = {
    "auth.errors.emailRequired": "Email is required",
    "auth.errors.emailInvalid": "Invalid email format",
    "auth.errors.emailTooLong": "Email address is too long",
    "auth.errors.passwordRequired": "Password is required",
    "auth.errors.passwordMinLength": "Must have at least 6 characters",
    "auth.errors.passwordTooLong": "Password is too long",
    "auth.errors.passwordLowercase": "At least one lowercase letter required",
    "auth.errors.passwordUppercase": "At least one uppercase letter required",
    "auth.errors.passwordNumber": "Must contain at least one number",
    "auth.errors.passwordSpaces": "Cannot contain spaces",
    "auth.errors.passwordMismatch": "Passwords do not match",
    "auth.errors.fullNameRequired": "Full name is required",
    "auth.errors.fullNameShort": "Must have at least 4 characters",
    "auth.errors.fullNameTooLong": "Full name is too long",
    "auth.errors.fullNameInvalid": "Contains invalid characters",
  };
  return translations[key] || key;
};

describe("validation service", () => {
  describe("validateAuthForm", () => {
    it("validates login form correctly", () => {
      const formData = {
        email: "test@example.com",
        password: "Test123",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("validates registration form correctly", () => {
      const formData = {
        fullName: "John Doe",
        email: "test@example.com",
        password: "Test123",
        confirmPassword: "Test123",
      };

      const result = validateAuthForm(formData, "register", mockT);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("validates forgot password form correctly", () => {
      const formData = {
        email: "test@example.com",
      };

      const result = validateAuthForm(formData, "forgot", mockT);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("returns errors for invalid email", () => {
      const formData = {
        email: "invalid-email",
        password: "Test123",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe("Invalid email format");
    });

    it("returns errors for weak passwords", () => {
      const formData = {
        email: "test@example.com",
        password: "weak",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe("Must have at least 6 characters");
    });

    it("requires uppercase letter in password", () => {
      const formData = {
        email: "test@example.com",
        password: "test123",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe(
        "At least one uppercase letter required"
      );
    });

    it("requires lowercase letter in password", () => {
      const formData = {
        email: "test@example.com",
        password: "TEST123",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe(
        "At least one lowercase letter required"
      );
    });

    it("requires number in password", () => {
      const formData = {
        email: "test@example.com",
        password: "TestPass",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe("Must contain at least one number");
    });

    it("rejects passwords with spaces", () => {
      const formData = {
        email: "test@example.com",
        password: "Test 123",
      };

      const result = validateAuthForm(formData, "login", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe("Cannot contain spaces");
    });

    it("validates full name correctly", () => {
      const formData = {
        fullName: "Jo",
        email: "test@example.com",
        password: "Test123",
        confirmPassword: "Test123",
      };

      const result = validateAuthForm(formData, "register", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe("Must have at least 4 characters");
    });

    it("validates full name with invalid characters", () => {
      const formData = {
        fullName: "John@Doe",
        email: "test@example.com",
        password: "Test123",
        confirmPassword: "Test123",
      };

      const result = validateAuthForm(formData, "register", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe("Contains invalid characters");
    });

    it("validates password confirmation mismatch", () => {
      const formData = {
        fullName: "John Doe",
        email: "test@example.com",
        password: "Test123",
        confirmPassword: "Different123",
      };

      const result = validateAuthForm(formData, "register", mockT);
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe("Passwords do not match");
    });
  });

  describe("validateField", () => {
    it("validates individual field correctly", () => {
      const formData = { email: "", password: "Test123" };
      const error = validateField(
        "email",
        "test@example.com",
        formData,
        "login",
        mockT
      );
      expect(error).toBeNull();
    });

    it("returns error for invalid field", () => {
      const formData = { email: "", password: "Test123" };
      const error = validateField(
        "email",
        "invalid-email",
        formData,
        "login",
        mockT
      );
      expect(error).toBe("Invalid email format");
    });
  });

  describe("sanitizeInput", () => {
    it("sanitizes HTML tags", () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
    });

    it("sanitizes quotes", () => {
      const input = "He said \"Hello\" and she said 'Hi'";
      const result = sanitizeInput(input);
      expect(result).not.toContain('"');
      expect(result).not.toContain("'");
    });

    it("trims whitespace", () => {
      const input = "  hello world  ";
      const result = sanitizeInput(input);
      expect(result).toBe("hello world");
    });

    it("handles non-string input", () => {
      const result = sanitizeInput(123);
      expect(result).toBe("");
    });
  });

  describe("validateInput", () => {
    it("handles unknown validation type", () => {
      const result = validateInput("unknown", "value");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Unknown validation type");
    });
  });
});
