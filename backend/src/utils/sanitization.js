/**
 * Input sanitization utilities for preventing injection attacks
 */

/**
 * Sanitize string input to prevent SQL injection and XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== "string") {
    return input;
  }

  return (
    input
      // Remove potential SQL injection keywords (case-insensitive)
      .replace(
        /\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|on\w+\s*=)\b/gi,
        ""
      )
      // Remove SQL comment patterns
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove potential XSS patterns
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .replace(/alert\s*\(/gi, "")
      .replace(/eval\s*\(/gi, "")
      .replace(/document\./gi, "")
      .replace(/window\./gi, "")
      // Normalize whitespace
      .trim()
      .replace(/\s+/g, " ")
  );
};

/**
 * Sanitize object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === "object") {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
};

/**
 * Express middleware for sanitizing request data
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    // Can't reassign req.query directly, need to modify individual properties
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  if (req.params) {
    // Can't reassign req.params directly, need to modify individual properties
    for (const key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
  }

  next();
};

export default {
  sanitizeString,
  sanitizeObject,
  sanitizeInput,
};
