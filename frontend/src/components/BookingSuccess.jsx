import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import CheckCircleIcon from "../assets/icons/check-circle-svgrepo-com.svg";

/**
 * BookingSuccess - Success message component for completed bookings
 *
 * @component
 * @description A confirmation component that displays booking success information
 * with animated check mark and booking details.
 *
 * Features:
 * - Animated success check mark
 * - Booking confirmation details
 * - Professional styling with green theme
 * - Responsive design
 * - Localization support
 *
 * @param {Object} props - Component props
 * @param {Object} props.bookingDetails - The booking details object
 * @param {string} props.bookingDetails.date - Formatted booking date
 * @param {string} props.bookingDetails.timeSlot - Selected time slot
 * @param {string} props.bookingDetails.address - Customer address
 * @param {string} props.bookingDetails.phoneNumber - Customer phone number
 * @param {string} props.bookingDetails.paymentMethod - Selected payment method
 * @param {string} props.bookingDetails.city - Selected city
 * @param {Function} props.onClose - Function to close the success message
 *
 * @returns {JSX.Element} The rendered success message component
 */
const BookingSuccess = ({ bookingDetails, onClose }) => {
  const { t } = useLanguage();

  const { date, timeSlot, address, phoneNumber, paymentMethod, city } =
    bookingDetails;

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Save current overflow value
    const originalOverflow = document.body.style.overflow;
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        className="bg-white font-body border-2 border-black rounded-lg shadow-2xl p-8 max-w-md w-full mx-auto"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            type: "spring",
            stiffness: 200,
          }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={CheckCircleIcon}
              alt="Success"
              className="w-12 h-12 text-green-600"
            />
          </div>
        </motion.div>

        {/* Success Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl uppercase font-bold text-green-600 text-center mb-4"
        >
          {t("bookingSuccess.title")}
        </motion.h2>

        {/* Success Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-gray-700 text-center mb-6"
        >
          {t("bookingSuccess.message")}
        </motion.p>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 border-2 border-black rounded-lg p-4 mb-6 space-y-3"
        >
          <h3 className="font-semibold text-gray-800 mb-3">
            {t("bookingSuccess.bookingDetails")}
          </h3>

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("bookingSuccess.date")}</span>
              <span className="font-medium text-gray-800">{date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("bookingSuccess.time")}</span>
              <span className="font-medium text-gray-800">{timeSlot}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("bookingSuccess.city")}</span>
              <span className="font-medium text-gray-800">{city}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                {t("bookingSuccess.address")}
              </span>
              <span className="font-medium text-gray-800">{address}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("bookingSuccess.phone")}</span>
              <span className="font-medium text-gray-800">{phoneNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                {t("bookingSuccess.payment")}
              </span>
              <span className="font-medium text-gray-800">{paymentMethod}</span>
            </div>
          </div>
        </motion.div>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="block mx-auto w-2/4 cursor-pointer bg-red-600 hover:bg-red-800
          text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {t("bookingSuccess.close")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookingSuccess;
