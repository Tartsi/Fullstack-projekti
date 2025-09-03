/**
 * Form Validation Service
 *
 * This module provides form validation functions for user authentication
 * and other form inputs throughout the application.
 */

/**
 * Validates user authentication forms (login, register, forgot password)
 * with enhanced input validation and error handling.
 *
 * @param {Object} formData - The form data to validate
 * @param {string} viewType - The type of form ('login', 'register', 'forgot')
 * @param {Object} t - Translation function for error messages
 * @returns {Object} - Object containing validation errors and success status
 */
export const validateAuthForm = (formData, viewType, t) => {
  const errors = {};

  // Enhanced email validation
  if (!formData.email?.trim()) {
    errors.email = t("auth.errors.emailRequired");
  } else {
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailPattern.test(formData.email)) {
      errors.email = t("auth.errors.emailInvalid");
    } else if (formData.email.length > 254) {
      errors.email = t("auth.errors.emailTooLong");
    }
  }

  // Password validation with enhanced security checks
  if (viewType !== "forgot") {
    if (!formData.password) {
      errors.password = t("auth.errors.passwordRequired");
    } else {
      if (formData.password.length < 6) {
        errors.password = t("auth.errors.passwordMinLength");
      } else if (formData.password.length > 128) {
        errors.password = t("auth.errors.passwordTooLong");
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.password = t("auth.errors.passwordLowercase");
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.password = t("auth.errors.passwordUppercase");
      } else if (!/(?=.*\d)/.test(formData.password)) {
        errors.password = t("auth.errors.passwordNumber");
      } else if (/\s/.test(formData.password)) {
        errors.password = t("auth.errors.passwordSpaces");
      }
    }
  }

  // Registration-specific validations
  if (viewType === "register") {
    // Full name validation
    if (!formData.fullName?.trim()) {
      errors.fullName = t("auth.errors.fullNameRequired");
    } else {
      if (formData.fullName.trim().length < 4) {
        errors.fullName = t("auth.errors.fullNameShort");
      } else if (formData.fullName.length > 100) {
        errors.fullName = t("auth.errors.fullNameTooLong");
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.fullName.trim())) {
        errors.fullName = t("auth.errors.fullNameInvalid");
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = t("auth.errors.passwordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t("auth.errors.passwordMismatch");
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates individual input fields in real-time
 *
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Current value of the field
 * @param {Object} formData - Complete form data for cross-field validation
 * @param {string} viewType - Current view type
 * @param {Object} t - Translation function
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (fieldName, value, formData, viewType, t) => {
  const tempFormData = { ...formData, [fieldName]: value };
  const validation = validateAuthForm(tempFormData, viewType, t);
  return validation.errors[fieldName] || null;
};

/**
 * Sanitizes user input to prevent XSS attacks
 *
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
};

/**
 * General purpose validation for common input types
 *
 * @param {string} type - Type of validation
 * @param {string} value - Value to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateInput = (type, value) => {
  const patterns = {
    alphanumeric: /^[a-zA-Z0-9]+$/,
    alphabetic: /^[a-zA-Z]+$/,
    numeric: /^\d+$/,
  };

  const pattern = patterns[type];
  if (!pattern) {
    return { isValid: false, error: "Unknown validation type" };
  }

  const isValid = pattern.test(value);
  return {
    isValid,
    error: isValid ? null : `Invalid ${type} format`,
  };
};
