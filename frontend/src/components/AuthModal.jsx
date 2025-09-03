import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
} from "../services/users";
import { validateAuthForm } from "../services/validation";
import crossIcon from "../assets/icons/cross-svgrepo-com.svg";
import userAddIcon from "../assets/icons/user-add-svgrepo-com.svg";
import userCheckIcon from "../assets/icons/user-check-svgrepo-com.svg";
import emailIcon from "../assets/icons/email-envelope-letter-message-fast-svgrepo-com.svg";
import NotificationMessage from "./NotificationMessage";

/**
 * AuthModal Component
 *
 * This component renders a modal for user authentication, supporting login, registration,
 * and password reset functionalities. It includes animations, form validation, and
 * notification handling.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {Function} props.onClose - Callback function to close the modal.
 *
 * @returns {JSX.Element} The rendered AuthModal component.
 *
 * @example
 * <AuthModal isOpen={true} onClose={() => setIsOpen(false)} />
 */
const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const prefersReducedMotion = useReducedMotion();

  // Animation configurations
  const EASE_OUT_QUINT = [0.22, 1, 0.36, 1];
  const fastTween = prefersReducedMotion
    ? { duration: 0 }
    : { type: "tween", duration: 1, ease: EASE_OUT_QUINT };
  const microTween = prefersReducedMotion
    ? { duration: 0 }
    : { type: "tween", duration: 0.18, ease: "easeOut" };
  const buttonSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 520, damping: 26 };

  // Common CSS classes
  const inputBaseClasses = `
    w-full 
    px-4 
    py-3 
    border 
    rounded-full 
    focus:outline-none 
    focus:ring-2 
    focus:ring-brand-purple 
    focus:border-brand-purple 
    transition-all 
    duration-300 
    font-sans
  `;
  const errorClasses =
    "border-red-500 text-red-600 placeholder-red-500 animate-pulse";
  const normalClasses = "border-gray-300 text-black";

  // Create new account, Forgot your password links
  const linkBaseClasses =
    "text-sm transition-colors duration-300 font-cottage cursor-pointer hover:underline";
  const primaryButtonClasses = "text-brand-purple hover:text-brand-dark";
  const secondaryButtonClasses =
    "text-gray-600 hover:text-gray-800 transition-colors duration-150";

  const submitButtonClasses = `block w-2/4
  mx-auto bg-brand-purple hover:bg-brand-dark text-black py-2 px-3 rounded-full
  font-cottage font-medium transition-colors duration-150 disabled:opacity-50
  disabled:cursor-not-allowed border-2 border-black hover:border-brand-neon
  shadow-lg hover:shadow-brand-purple/50 uppercase tracking-wider cursor-pointer`;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView("login");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setNotification({
        isVisible: false,
        message: "",
        type: "success",
      });

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Auto-hide notification messages
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (errors[name]) {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }, 100);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  };

  // Auto-clear error fields after 3 seconds
  useEffect(() => {
    const errorFields = Object.keys(errors).filter(
      (key) => key !== "submit" && errors[key]
    );

    if (errorFields.length > 0) {
      const timer = setTimeout(() => {
        errorFields.forEach((field) => {
          setFormData((prev) => ({ ...prev, [field]: "" }));
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          errorFields.forEach((field) => delete newErrors[field]);
          return newErrors;
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Clear all form fields
  const clearFormFields = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Get submit button icon based on current view
  const getSubmitIcon = () => {
    switch (currentView) {
      case "register":
        return userAddIcon;
      case "forgot":
        return emailIcon;
      default:
        return userCheckIcon;
    }
  };

  // Get submit button text based on current view and loading state
  const getSubmitText = () => {
    if (isLoading) {
      switch (currentView) {
        case "register":
          return t("auth.creating");
        case "forgot":
          return t("auth.sending");
        default:
          return t("auth.signingIn");
      }
    }

    switch (currentView) {
      case "register":
        return t("auth.createAccount");
      case "forgot":
        return t("auth.sendReset");
      default:
        return t("auth.signIn");
    }
  };

  // Get input className with error handling
  const getInputClasses = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  // Common input style for error animation
  const getInputStyle = (fieldName) => ({
    fontFamily: "Arial, sans-serif",
    animationDuration: errors[fieldName] ? "1.125s" : "0s",
  });

  // Render footer button with consistent styling
  const renderFooterButton = (onClick, text, icon = null, isPrimary = true) => (
    <div className="flex justify-center">
      <motion.button
        onClick={onClick}
        className={`${linkBaseClasses} ${
          isPrimary ? primaryButtonClasses : secondaryButtonClasses
        }`}
        whileHover={{
          scale: prefersReducedMotion ? 1 : isPrimary ? 1.1 : 1.04,
        }}
        transition={isPrimary ? buttonSpring : microTween}
        type="button"
      >
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm font-medium">{text}</span>
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
        </div>
      </motion.button>
    </div>
  );

  // Form validation using the validation service
  const validateForm = () => {
    const validation = validateAuthForm(formData, currentView, t);

    // Clear fields that have errors
    if (!validation.isValid) {
      Object.keys(validation.errors).forEach((field) => {
        setFormData((prev) => ({ ...prev, [field]: "" }));
      });
    }

    setErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let result;

      if (currentView === "register") {
        result = await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
      } else if (currentView === "login") {
        result = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else if (currentView === "forgot") {
        result = await requestPasswordReset({
          email: formData.email,
        });
      }

      if (result.success) {
        // If login was successful, update the global auth state
        if (currentView === "login" && result.user) {
          login(result.user);
        }

        setNotification({
          isVisible: true,
          message:
            result.message ||
            (currentView === "register"
              ? t("auth.registrationSuccess")
              : currentView === "login"
              ? t("auth.loginSuccess")
              : t("auth.passwordResetSuccess")),
          type: "success",
        });

        clearFormFields();

        setTimeout(() => {
          if (currentView === "register" || currentView === "forgot") {
            setCurrentView("login");
            setNotification((prev) => ({ ...prev, isVisible: false }));
          } else if (currentView === "login") {
            onClose();
            setNotification((prev) => ({ ...prev, isVisible: false }));
          }
        }, 2000);
      } else {
        setNotification({
          isVisible: true,
          message:
            result.message ||
            (currentView === "register"
              ? t("auth.errors.registrationFailed")
              : currentView === "login"
              ? t("auth.errors.loginFailed")
              : t("auth.errors.networkError")),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setNotification({
        isVisible: true,
        message:
          currentView === "register"
            ? t("auth.errors.registrationFailed")
            : currentView === "login"
            ? t("auth.errors.loginFailed")
            : t("auth.errors.networkError"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between views
  const switchView = (view) => {
    setCurrentView(view);
    setErrors({});
    clearFormFields();
    setNotification({
      isVisible: false,
      message: "",
      type: "success",
    });
  };

  // Backdrop click handler
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fastTween}
            className="absolute inset-0 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            layout
            layoutId="auth-modal"
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={fastTween}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border-2 border-black overflow-hidden origin-top"
            style={{ transformOrigin: "top center" }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              whileHover={{
                scale: prefersReducedMotion ? 1 : 1.2,
                rotate: prefersReducedMotion ? 0 : 90,
              }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
              transition={buttonSpring}
              type="button"
            >
              <img src={crossIcon} alt="Close" className="w-5 h-5" />
            </motion.button>

            {/* Notification Message */}
            <NotificationMessage
              isVisible={notification.isVisible}
              message={notification.message}
              type={notification.type}
              context={currentView}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Form Content */}
            <motion.div
              layout
              className="p-8 pt-12"
              transition={{
                layout: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={fastTween}
                >
                  {/* Header */}
                  <div className="text-center mb-6" aria-live="polite">
                    <h2
                      id="auth-modal-title"
                      className="text-2xl font-bold underline text-gray-900 mb-2 font-cottage"
                    >
                      {currentView === "register"
                        ? t("auth.createAccount")
                        : currentView === "forgot"
                        ? t("auth.resetPassword")
                        : t("auth.login")}
                    </h2>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Register fields */}
                    {currentView === "register" && (
                      <div>
                        <input
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder={errors.fullName || t("auth.fullName")}
                          className={getInputClasses("fullName")}
                          style={getInputStyle("fullName")}
                        />
                      </div>
                    )}

                    {/* Email field for all views */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={errors.email || t("auth.email")}
                        className={getInputClasses("email")}
                        style={getInputStyle("email")}
                      />
                    </div>

                    {/* Password field (Register + Login) */}
                    {currentView !== "forgot" && (
                      <div>
                        <input
                          type="password"
                          name="password"
                          autoComplete={
                            currentView === "login"
                              ? "current-password"
                              : "new-password"
                          }
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder={errors.password || t("auth.password")}
                          className={getInputClasses("password")}
                          style={getInputStyle("password")}
                        />
                      </div>
                    )}

                    {/* Confirm password */}
                    {currentView === "register" && (
                      <div>
                        <input
                          type="password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder={
                            errors.confirmPassword || t("auth.confirmPassword")
                          }
                          className={getInputClasses("confirmPassword")}
                          style={getInputStyle("confirmPassword")}
                        />
                      </div>
                    )}

                    {/* Submit error */}
                    {errors.submit && (
                      <p className="text-red-500 text-sm text-center">
                        {errors.submit}
                      </p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={submitButtonClasses}
                      whileHover={{
                        scale: isLoading || prefersReducedMotion ? 1 : 1.05,
                      }}
                      whileTap={{
                        scale: isLoading || prefersReducedMotion ? 1 : 0.95,
                      }}
                      transition={buttonSpring}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>{getSubmitText()}</span>
                        {!isLoading && (
                          <img
                            src={getSubmitIcon()}
                            alt=""
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    </motion.button>
                  </form>

                  {/* Footer Links */}
                  <motion.div layout className="mt-6 text-center space-y-3">
                    {currentView === "login" && (
                      <>
                        {renderFooterButton(
                          () => switchView("register"),
                          t("auth.createNewUser"),
                          userAddIcon
                        )}

                        {renderFooterButton(
                          () => switchView("forgot"),
                          t("auth.forgotPassword"),
                          null,
                          false
                        )}
                      </>
                    )}

                    {currentView === "register" &&
                      renderFooterButton(
                        () => switchView("login"),
                        t("auth.backToLogin")
                      )}

                    {currentView === "forgot" &&
                      renderFooterButton(
                        () => switchView("login"),
                        t("auth.backToLogin")
                      )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
