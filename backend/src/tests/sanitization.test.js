/**
 * Tests for input sanitization utilities
 */

import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizeObject } from "../utils/sanitization.js";

describe("Input Sanitization", () => {
  describe("sanitizeString", () => {
    it("should remove SQL injection keywords", () => {
      const maliciousInput = "test'; DROP TABLE users; --";
      const result = sanitizeString(maliciousInput);
      expect(result).not.toContain("DROP");
      expect(result).not.toContain("--");
    });

    it("should remove various SQL keywords case-insensitively", () => {
      const inputs = [
        "SELECT * FROM users",
        "insert into table",
        "UPDATE users SET",
        "DELETE FROM users",
        "UNION SELECT",
      ];

      inputs.forEach((input) => {
        const result = sanitizeString(input);
        expect(result).not.toContain("SELECT");
        expect(result).not.toContain("INSERT");
        expect(result).not.toContain("UPDATE");
        expect(result).not.toContain("DELETE");
        expect(result).not.toContain("UNION");
      });
    });

    it("should remove script tags and javascript", () => {
      const xssInput = '<script>alert("xss")</script>';
      const result = sanitizeString(xssInput);
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
    });

    it("should handle normal text correctly", () => {
      const normalText = "John Doe";
      const result = sanitizeString(normalText);
      expect(result).toBe("John Doe");
    });

    it("should trim and normalize whitespace", () => {
      const messyText = "  multiple   spaces   ";
      const result = sanitizeString(messyText);
      expect(result).toBe("multiple spaces");
    });
  });

  describe("sanitizeObject", () => {
    it("should sanitize all string properties in an object", () => {
      const input = {
        name: "John",
        email: "john@example.com",
        malicious: "'; DROP TABLE users; --",
      };

      const result = sanitizeObject(input);
      expect(result.name).toBe("John");
      expect(result.email).toBe("john@example.com");
      expect(result.malicious).not.toContain("DROP");
    });

    it("should handle nested objects", () => {
      const input = {
        user: {
          profile: {
            bio: "'; SELECT * FROM secrets; --",
          },
        },
      };

      const result = sanitizeObject(input);
      expect(result.user.profile.bio).not.toContain("SELECT");
    });

    it("should handle arrays", () => {
      const input = {
        tags: ["normal", "'; DROP TABLE users; --", "another"],
      };

      const result = sanitizeObject(input);
      expect(result.tags[0]).toBe("normal");
      expect(result.tags[1]).not.toContain("DROP");
      expect(result.tags[2]).toBe("another");
    });
  });
});
