import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser, deleteUser, getUserBookings } from "../services/users";
import { deleteBooking } from "../services/bookings";
import { sanitizeInput } from "../services/validation";
import crossIcon from "../assets/icons/cross-svgrepo-com.svg";
import accountIcon from "../assets/icons/account-manage-personal-svgrepo-com.svg";
import eyeVisibleIcon from "../assets/icons/eye-visible-svgrepo-com.svg";
import eyeHiddenIcon from "../assets/icons/eye-hidden-svgrepo-com.svg";
import NotificationMessage from "./NotificationMessage";

/**
 * UserModal Component
 *
 * This component renders a modal for displaying user profile information,
 * including user details and account management options.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {Function} props.onClose - Callback function to close the modal.
 *
 * @returns {JSX.Element} The rendered UserModal component.
 */
const UserModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const prefersReducedMotion = useReducedMotion();

  // Reusable CSS class constants
  const CSS_CLASSES = {
    // Common text styles
    fieldLabel: "text-black underline mb-2 font-sans font-semibold",
    fieldValue: "text-gray-800 font-sans font-medium text-lg",
    sectionTitle:
      "text-black text-xl font-sans font-bold mb-4 text-center underline",

    // Button styles
    primaryButton: `
      bg-brand-purple hover:bg-brand-dark text-white font-cottage text-lg px-8 py-4 rounded-full
      shadow-2xl hover:shadow-brand-purple/50 transform hover:scale-105 transition-all duration-300
      uppercase tracking-wider border-2 border-black hover:border-brand-neon cursor-pointer`,
    dangerButton: `
      bg-red-600 hover:bg-red-700 text-white font-cottage text-lg px-8
      py-4 rounded-full shadow-2xl transform hover:scale-105
      transition-all duration-300 uppercase tracking-wider cursor-pointer`,
    secondaryButton: `
      bg-gray-300 hover:bg-gray-400 text-black font-cottage text-lg
      px-8 py-4 rounded-full shadow-lg transform hover:scale-105
      transition-all duration-300 uppercase tracking-wider cursor-pointer`,

    // Layout styles
    modalOverlay:
      "fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-2 md:p-4",
    modalContainer:
      "bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] md:max-h-[90vh] mx-auto relative overflow-y-auto border-2 border-black",
    closeButton:
      "absolute top-4 right-4 p-2 z-10 cursor-pointer rounded-full hover:bg-gray-200 transition-colors",
    contentPadding: "p-8",
    sectionContainer: "border-2 border-gray-300 rounded-lg p-4 bg-gray-50",

    // Icon sizes
    smallIcon: "w-6 h-6",
    mediumIcon: "w-12 h-12",
    largeIcon: "w-60 h-50",

    // Loading and spacing
    loadingSpinner:
      "animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mx-auto",
    loadingText: "mt-4 text-gray-600 font-cottage",
    verticalSpace: "space-y-6",
    horizontalSpace: "space-y-4",
  };

  // Animation configurations
  const EASE_OUT_QUINT = [0.22, 1, 0.36, 1];
  const fastTween = prefersReducedMotion
    ? { duration: 0 }
    : { type: "tween", duration: 1.5, ease: EASE_OUT_QUINT };
  const microTween = prefersReducedMotion
    ? { duration: 0 }
    : { type: "tween", duration: 0.625, ease: "easeOut" };
  const buttonSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 240, damping: 25 };

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
    border-gray-300 
    text-black
  `;

  const buttonBaseClasses = `
    px-6 
    py-3 
    rounded-full 
    font-sans 
    font-medium 
    transition-all 
    duration-300 
    border-2 
    uppercase 
    tracking-wider 
    cursor-pointer
  `;

  // Load user details when modal opens
  useEffect(() => {
    if (isOpen && user) {
      const fetchData = async () => {
        setIsLoading(true);
        setIsLoadingBookings(true);

        try {
          const [userResponse, bookingsResponse] = await Promise.all([
            getCurrentUser(),
            getUserBookings(),
          ]);

          if (userResponse.success && userResponse.user) {
            setUserDetails(userResponse.user);
          }

          if (bookingsResponse.success) {
            setUserBookings(bookingsResponse.bookings || []);
          }
        } catch (error) {
          console.error("Error while loading user details:", error);
        } finally {
          setIsLoading(false);
          setIsLoadingBookings(false);
        }
      };

      fetchData();
    }
  }, [isOpen, user]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false);
      setDeletePassword("");
      setShowDeletePassword(false);
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  // Handle animated close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 375);
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(t("userProfile.deleteBookingConfirm"))) {
      return;
    }

    setDeletingBookingId(bookingId);

    try {
      await deleteBooking(bookingId);

      // Remove the booking from the local state
      setUserBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );

      setNotification({
        isVisible: true,
        message: t("userProfile.bookingDeleted"),
        type: "success",
      });
    } catch (error) {
      console.error("Delete booking error:", error);
      setNotification({
        isVisible: true,
        message: t("userProfile.bookingDeleteError"),
        type: "error",
      });
    } finally {
      setDeletingBookingId(null);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const sanitizedPassword = sanitizeInput(deletePassword);

    if (!sanitizedPassword.trim()) {
      setNotification({
        isVisible: true,
        message: t("userProfile.enterPassword"),
        type: "error",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteUser({
        password: sanitizedPassword,
      });

      if (result.success) {
        setNotification({
          isVisible: true,
          message: t("userProfile.accountDeleted"),
          type: "success",
        });

        // Log out user and close modal after a delay
        setTimeout(() => {
          logout();
          onClose();
        }, 2000);
      } else {
        setNotification({
          isVisible: true,
          message: result.message || t("userProfile.deleteError"),
          type: "error",
        });
        setDeletePassword(""); // Clear password field on error
        setShowDeletePassword(false);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      setNotification({
        isVisible: true,
        message: t("userProfile.deleteError"),
        type: "error",
      });
      setDeletePassword(""); // Clear password field on error
      setShowDeletePassword(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fi" ? "fi-FI" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Format booking status for display
  const formatBookingStatus = (status) => {
    if (!status) return "";
    const statusKey = status.toLowerCase();
    return t(`userProfile.bookingStatus.${statusKey}`) || status;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={CSS_CLASSES.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fastTween}
        onClick={handleClose}
      >
        <motion.div
          className={CSS_CLASSES.modalContainer}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{
            scale: isClosing ? 0.9 : 1,
            opacity: isClosing ? 0 : 1,
            y: isClosing ? 20 : 0,
          }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={fastTween}
          onClick={(event) => event.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            onClick={handleClose}
            className={CSS_CLASSES.closeButton}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1, rotate: 90 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
            transition={buttonSpring}
          >
            <img
              src={crossIcon}
              alt="Close"
              className={CSS_CLASSES.smallIcon}
            />
          </motion.button>

          {/* Modal Content */}
          <div className={CSS_CLASSES.contentPadding}>
            {/* Header */}
            {!showDeleteConfirm && (
              <div className="text-left mb-8">
                <h2 className={CSS_CLASSES.sectionTitle}>
                  {t("userProfile.title")}
                </h2>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className={CSS_CLASSES.loadingSpinner}></div>
                <p className={CSS_CLASSES.loadingText}>
                  {t("userProfile.loadingState")}
                </p>
              </div>
            )}

            {/* User Details */}
            {!isLoading && userDetails && !showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={microTween}
                className={CSS_CLASSES.verticalSpace}
              >
                {/* Basic Information Section */}
                <div className={CSS_CLASSES.sectionContainer}>
                  <h3 className={CSS_CLASSES.sectionTitle}>
                    {t("userProfile.basicInfo")}
                  </h3>

                  {/* Responsive layout: flex on larger screens, centered on mobile */}
                  <div className="flex items-start gap-6 max-sm:block max-sm:text-center">
                    {/* User Details - Left Side (centered on mobile) */}
                    <div
                      className={`flex-1 ${CSS_CLASSES.horizontalSpace} max-sm:mx-auto`}
                    >
                      {/* Full Name */}
                      <div>
                        <p className={CSS_CLASSES.fieldLabel}>
                          {t("userProfile.fullName")}
                        </p>
                        <div className={CSS_CLASSES.fieldValue}>
                          {userDetails.fullName || "N/A"}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <p className={CSS_CLASSES.fieldLabel}>
                          {t("userProfile.email")}
                        </p>
                        <div className={CSS_CLASSES.fieldValue}>
                          {userDetails.email}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <p className={CSS_CLASSES.fieldLabel}>
                          {t("userProfile.role")}
                        </p>
                        <div className={CSS_CLASSES.fieldValue}>
                          {formatRole(userDetails.role)}
                        </div>
                      </div>

                      {/* Member Since */}
                      <div>
                        <p className={CSS_CLASSES.fieldLabel}>
                          {t("userProfile.memberSince")}
                        </p>
                        <div className={CSS_CLASSES.fieldValue}>
                          {formatDate(userDetails.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Account Icon - Right Side (hidden on smaller screens nearing width of 600px) */}
                    <div className="flex-shrink-0 items-center justify-center sm:flex hidden">
                      <img
                        src={accountIcon}
                        alt="Account"
                        className={`${CSS_CLASSES.largeIcon} opacity-80 filter drop-shadow-md mt-7`}
                      />
                    </div>
                  </div>
                </div>

                {/* Bookings Section */}
                <div>
                  <label className="block text-center underline text-lg font-sans font-semibold text-gray-700 mb-2">
                    {t("userProfile.bookings")}
                  </label>

                  {isLoadingBookings ? (
                    <div className="bg-gray-50 px-4 py-3 rounded-lg border text-gray-800 font-sans text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-purple mx-auto mb-2"></div>
                      {t("userProfile.loadingBookings")}
                    </div>
                  ) : userBookings.length > 0 ? (
                    <div className="space-y-3 ">
                      {userBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-gray-50 px-4 py-3 rounded-lg border"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-gray-800">
                                {formatDate(booking.date)}
                              </p>
                              {booking.timeSlot && (
                                <p className="text-sm text-gray-600 font-sans">
                                  {booking.timeSlot}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 font-sans">
                                {t("userProfile.bookingLocation")}{" "}
                                {booking.location}
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end space-y-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-sans underline uppercase tracking-wider ${
                                  booking.status === "CONFIRMED"
                                    ? "bg-green-200 text-black"
                                    : booking.status === "DRAFT"
                                    ? "bg-yellow-200 text-black"
                                    : "bg-gray-200 text-black"
                                }`}
                              >
                                {formatBookingStatus(booking.status)}
                              </span>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={deletingBookingId === booking.id}
                                className="text-xs text-red-600 uppercase hover:text-red-800 font-sans cursor-pointer underline disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deletingBookingId === booking.id
                                  ? t("userProfile.deletingBooking")
                                  : t("userProfile.deleteBooking")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-lg border text-gray-800 font-sans text-center italic">
                      {t("userProfile.noBookings")}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-4">
                  {/* Delete Account Button */}
                  <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`${buttonBaseClasses} w-full bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600`}
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                    transition={buttonSpring}
                  >
                    {t("userProfile.deleteAccount")}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={microTween}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-sans font-bold underline text-red-600 mb-4">
                    {t("userProfile.deleteConfirm")}
                  </h3>
                  <p className="text-gray-700 font-sans mb-6">
                    {t("userProfile.deleteWarning")}
                  </p>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm text-center font-sans font-semibold text-gray-700 mb-2">
                    {t("userProfile.enterPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className={inputBaseClasses}
                      placeholder={t("auth.password")}
                      disabled={isDeleting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1
                    hover:bg-gray-100 rounded-full transition-colors duration-200"
                      tabIndex={-1}
                      disabled={isDeleting}
                    >
                      <img
                        src={
                          showDeletePassword ? eyeHiddenIcon : eyeVisibleIcon
                        }
                        alt={
                          showDeletePassword ? "Hide password" : "Show password"
                        }
                        className="w-5 h-5 opacity-60 hover:opacity-80"
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setShowDeletePassword(false);
                    }}
                    className={`${buttonBaseClasses} flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-200 hover:border-gray-300`}
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                    transition={buttonSpring}
                    disabled={isDeleting}
                  >
                    {t("userProfile.cancel")}
                  </motion.button>

                  <motion.button
                    onClick={handleDeleteAccount}
                    className={`${buttonBaseClasses} flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 ${
                      isDeleting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={{
                      scale: prefersReducedMotion || isDeleting ? 1 : 1.02,
                    }}
                    whileTap={{
                      scale: prefersReducedMotion || isDeleting ? 1 : 0.98,
                    }}
                    transition={buttonSpring}
                    disabled={isDeleting}
                  >
                    {isDeleting
                      ? t("userProfile.deleting")
                      : t("userProfile.confirmDelete")}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Notification Message */}
          <NotificationMessage
            isVisible={notification.isVisible}
            message={notification.message}
            type={notification.type}
            onClose={() =>
              setNotification((prev) => ({ ...prev, isVisible: false }))
            }
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserModal;
