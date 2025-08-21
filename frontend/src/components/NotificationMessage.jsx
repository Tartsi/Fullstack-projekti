import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import userCheckIcon from "../assets/icons/user-check-svgrepo-com.svg";
import verifiedIcon from "../assets/icons/verified-svgrepo-com.svg";
import crossIcon from "../assets/icons/cross-svgrepo-com.svg";
import emailIcon from "../assets/icons/email-envelope-letter-message-check-confirm-svgrepo-com.svg";

/**
 * NotificationMessage component for displaying success and error messages
 *
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether the notification is visible
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of notification ('success' or 'error')
 * @param {string} props.context - Context for icon selection (e.g., 'register', 'login')
 * @param {boolean} props.prefersReducedMotion - Whether user prefers reduced motion
 */
const NotificationMessage = ({
  isVisible,
  message,
  type = "success",
  context = "login",
  prefersReducedMotion = false,
}) => {
  const { t } = useLanguage();

  // Animation settings
  const microTween = prefersReducedMotion
    ? { duration: 0 }
    : { type: "tween", duration: 0.18, ease: "easeOut" };

  // Get appropriate icon based on type and context
  const getIcon = () => {
    if (type === "error") {
      return crossIcon;
    }
    return context === "register"
      ? verifiedIcon
      : context === "forgot"
      ? emailIcon
      : userCheckIcon;
  }; // Get appropriate styling based on type
  const getStyles = () => {
    if (type === "error") {
      return {
        bg: "bg-red-500",
        text: "text-white",
      };
    }
    return {
      bg: "bg-green-500",
      text: "text-white",
    };
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={microTween}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.bg} ${styles.text}
            px-4 py-2 rounded-lg flex items-center space-x-2 z-20 shadow-lg`}
        >
          <span className="font-medium text-sm">{message}</span>
          <img
            src={getIcon()}
            alt={type === "error" ? t("auth.errorIcon") : t("auth.successIcon")}
            className="w-4 h-4"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationMessage;
