import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import {
  timeSlots,
  generateAvailableDates,
  isDateAvailable,
  isDateSelected,
  getAvailableTimeSlotsForDate,
  formatDateForDisplay,
  getWeekStart,
  getWeekDays,
  handlePreviousWeek,
  handleNextWeek,
  canGoToPreviousWeek,
  canGoToNextWeek,
  getWeekDisplayText,
  getCurrentMonthName,
  getDateColorClass,
  getAvailabilityBoxColorClass,
} from "../utils/calendarUtils";
import VacuumCleanerIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import WipingIcon from "../assets/icons/wiping-svgrepo-com.svg";
import TintingIcon from "../assets/icons/tinting-svgrepo-com.svg";
import CarSeatIcon from "../assets/icons/car-seat-svgrepo-com.svg";
import LockSlashIcon from "../assets/icons/lock-slash-svgrepo-com.svg";
import BankIcon from "../assets/icons/bank-svgrepo-com.svg";
import CashIcon from "../assets/icons/cash-payment-pay-money-cash-svgrepo-com.svg";
import CreditCardIcon from "../assets/icons/credit-card-svgrepo-com.svg";
import MobilepayIcon from "../assets/icons/mobilepay-svgrepo-com.svg";
import ThinkingIcon from "../assets/icons/thinking-consider-ponder-think-svgrepo-com.svg";
import WalletArrowIcon from "../assets/icons/wallet-arrow-right-svgrepo-com.svg";

/**
 * PricingCalendar - Booking interface component
 *
 * IMPORTANT: Currently uses placeholder data for demonstration purposes.
 * Backend integration required for production use.
 *
 * @component
 * @description A comprehensive booking interface with the following features:
 *
 * UI Design:
 * - White-themed design with vertical layout
 * - Progressive disclosure: price → date → time → payment
 * - Responsive design with smooth animations
 * - Purple accent colors for selected states
 *
 * Functionality:
 * - Large centered price display (49€ including VAT)
 * - Week-based calendar navigation (Monday-Friday only)
 * - Minimum booking window: 2 days from current date
 * - Time slot selection (4 x 2-hour intervals: 09:00-17:00)
 * - Multi-step payment method selection
 * - Real-time availability display with color coding
 * - Animated transitions between booking stages
 *
 * Layout Structure (progressive reveal):
 * 1. Price container with service details
 * 2. Date selection calendar (week view)
 * 3. Time slot selection grid
 * 4. Payment method selection
 * 5. Confirmation button
 *
 * Accessibility:
 * - Keyboard navigation support
 * - Screen reader friendly labels
 * - High contrast color schemes
 * - Focus management
 *
 * Security Considerations:
 * - Input validation on date/time selection
 * - No sensitive data stored in local state
 * - Payment processing handled externally
 *
 * @returns {JSX.Element} The rendered booking interface
 *
 * @example
 * // Basic usage in a page component
 * <PricingCalendar />
 *
 * @todo
 * - Integrate with backend API for real availability data
 * - Implement actual payment processing
 * - Add form validation for user inputs
 * - Add booking confirmation flow
 * - Implement calendar accessibility improvements
 */
const PricingCalendar = () => {
  const { t, language } = useLanguage();

  // Core booking state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Data state (TODO: Replace with API calls)
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Calendar navigation state
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // UI state for progressive disclosure animation
  const [isPriceSelected, setIsPriceSelected] = useState(false);
  const [showDateSection, setShowDateSection] = useState(false);
  const [showTimeSection, setShowTimeSection] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [showPaymentTooltip, setShowPaymentTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Refs for cleanup and DOM manipulation
  const timeoutRef = useRef(null);
  const sectionRef = useRef(null);

  // Initialize current week to start of this week on component mount
  useEffect(() => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
  }, []);

  // Intersection Observer: Trigger animations when 90% of component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once triggered to prevent re-animations
        }
      },
      {
        threshold: 0.9, // Trigger when 90% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize placeholder data (TODO: Replace with API call)
  useEffect(() => {
    const dates = generateAvailableDates();
    setAvailableDates(dates);

    // Reset all selections when data changes
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedPaymentMethod(null);
    setAvailableTimeSlots([]);
  }, []);

  // Update available time slots when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlotsForDate(selectedDate, availableDates);
      setAvailableTimeSlots(slots);
      setSelectedTimeSlot(null); // Reset time selection when date changes

      // If the selected date no longer has available slots, deselect it
      if (!slots || slots.length === 0) {
        setSelectedDate(null);
        setShowTimeSection(false);
      }
    } else {
      setShowTimeSection(false);
    }
  }, [selectedDate, availableDates]);

  /**
   * Handle date selection with validation
   * Only allows selection of dates with available time slots
   */
  const handleDateSelect = (date) => {
    if (isDateAvailable(date, availableDates)) {
      const slots = getAvailableTimeSlotsForDate(date, availableDates);
      // Security: Only select the date if it has available time slots
      if (slots && slots.length > 0) {
        setSelectedDate(date);
        // Reset dependent selections when changing date
        setSelectedTimeSlot(null);
        setSelectedPaymentMethod(null);

        // Progressive disclosure: Show time section after date selection
        setTimeout(() => {
          setShowTimeSection(true);
        }, 300);

        // Show payment section (in unselectable mode) when date is first selected
        setTimeout(() => {
          setShowPaymentSection(true);
        }, 800); // Delay to show after time section animation
      }
    } else {
      // Security: Clear payment method if date becomes unavailable
      setSelectedPaymentMethod(null);
    }
  };

  /**
   * Handle time slot selection
   * TODO: Add validation for business hours and slot availability
   */
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  /**
   * Handle payment method selection
   * TODO: Integrate with payment processor validation
   */
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  /**
   * Handle price container selection to start booking flow
   */
  const handlePriceSelect = () => {
    setIsPriceSelected(true);
    // Clear any existing timeout to prevent memory leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Trigger date section animation with slight delay for better UX
    timeoutRef.current = setTimeout(() => {
      setShowDateSection(true);
    }, 100);
  };

  /**
   * Week navigation handlers
   */
  const handlePreviousWeekClick = () => {
    setCurrentWeekStart(handlePreviousWeek(currentWeekStart));
  };

  const handleNextWeekClick = () => {
    setCurrentWeekStart(handleNextWeek(currentWeekStart));
  };

  /**
   * Handle payment confirmation
   * TODO: Replace with secure payment processing integration
   * SECURITY: Never expose payment data in console/alerts in production
   */
  const handlePaymentConfirmation = () => {
    if (selectedDate && selectedTimeSlot && selectedPaymentMethod) {
      // TODO: Implement secure payment processing
      // This should:
      // 1. Validate all selections server-side
      // 2. Create secure payment session
      // 3. Redirect to payment processor
      // 4. Handle success/failure callbacks

      console.log("Booking confirmation initiated:", {
        date: selectedDate.toISOString().split("T")[0], // Safe date format
        timeSlot: selectedTimeSlot.id, // Use ID instead of full object
        paymentMethod: selectedPaymentMethod, // This should be sanitized
        timestamp: new Date().toISOString(),
      });

      // Placeholder: In production, this would redirect to payment processor
      // Example: window.location.href = `/checkout?session=${secureSessionId}`;
    }
  };

  // Cleanup timeout on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="pricing"
      data-pricing-section
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-cottage italic tracking-wide text-brand-dark underline mb-12 text-center"
        >
          {t("services.title")}
        </motion.h2>

        {/* Large centered Price Container */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{
            scale: isPriceSelected ? 1.06 : 1,
          }}
          whileHover={{ scale: isPriceSelected ? 1.06 : 1.03 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={handlePriceSelect}
          className={`bg-white rounded-lg shadow-sm border-2 py-12 px-5 mb-8 text-center max-w-xs mx-auto font-sans cursor-pointer transition-all duration-700 ${
            isPriceSelected
              ? "border-black shadow-lg"
              : "border-gray-300 hover:border-black hover:shadow-md"
          }`}
          style={{
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div className="p-2 mb-4 bg-gray-100 mx-auto w-1/2 border-2 border-black rounded-b-2xl">
            <h2 className="text-lg font-normal text-gray-800 mb-2 underline">
              {t("pricing.title")}
            </h2>
            <div className="text-4xl text-gray-900 mb-1 font-bold">
              {t("pricing.price")}
            </div>
            <p className="text-sm text-gray-600 font-normal">
              {t("pricing.vatIncluded")}
            </p>
            <p className="text-sm text-gray-600 font-normal underline">
              {t("pricing.perCleaning")}
            </p>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-300 my-4" />

          {/* Explanation on its own line + underline */}
          <p className="text-gray-600 text-lg font-normal underline mb-4">
            {t("pricing.explanation")}
          </p>

          {/* Services list */}
          <div className="space-y-2">
            {[
              {
                icon: VacuumCleanerIcon,
                label: t("pricing.services.vacuuming"),
              },
              { icon: WipingIcon, label: t("pricing.services.wiping") },
              {
                icon: TintingIcon,
                label: t("pricing.services.windowCleaning"),
              },
              { icon: CarSeatIcon, label: t("pricing.services.seatCleaning") },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-start space-x-4">
                <img src={icon} alt="" className="w-14 h-6 flex-shrink-0" />
                <p className="text-gray-600 text-lg font-normal">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Date Selection Calendar */}
        {isPriceSelected && (
          <AnimatePresence initial={false}>
            {showDateSection && (
              <motion.div
                key="dateSelectionCalendar"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className={`bg-white rounded-lg shadow-md p-4 mt-16 max-w-md mx-auto font-sans border-2 transition-all duration-700 ${
                  isPriceSelected ? "border-black shadow-lg" : "border-gray-400"
                }`}
                style={{
                  transformOrigin: "top center",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 1.44 }}
                >
                  {/* Booking Instructions */}
                  <div className="mb-6 text-center px-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {t("pricing.calendar.bookingInstructions")}
                    </p>
                    <p className="text-gray-600 text-xs font-medium">
                      {t("pricing.calendar.bookingNote")}
                    </p>
                    <div className="border-t border-gray-300 mt-4 mb-2"></div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    {t("pricing.calendar.selectDate")}
                  </h3>

                  {/* Availability Legend */}
                  <div className="mb-4 px-2">
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-200 border border-green-200 rounded"></div>
                        <span className="text-gray-600">
                          {t("pricing.calendar.legend.fourSlots")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-200 border border-yellow-200 rounded"></div>
                        <span className="text-gray-600">
                          {t("pricing.calendar.legend.threeSlots")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-200 border border-orange-200 rounded"></div>
                        <span className="text-gray-600">
                          {t("pricing.calendar.legend.twoSlots")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-200 border border-red-200 rounded"></div>
                        <span className="text-gray-600">
                          {t("pricing.calendar.legend.oneSlot")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                        <span className="text-gray-600">
                          {t("pricing.calendar.legend.none")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Month Display */}
                  <div className="text-center mb-3">
                    <span className="text-sm font-bold text-gray-600">
                      {getCurrentMonthName(currentWeekStart, t)}
                    </span>
                  </div>

                  {/* Week Navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={handlePreviousWeekClick}
                      disabled={
                        !canGoToPreviousWeek(currentWeekStart, availableDates)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        canGoToPreviousWeek(currentWeekStart, availableDates)
                          ? "hover:bg-gray-100 cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <i
                        className={`fas fa-chevron-left ${
                          canGoToPreviousWeek(currentWeekStart, availableDates)
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}
                      ></i>
                    </button>
                    <span className="text-xs text-gray-500 font-bold">
                      {getWeekDisplayText(currentWeekStart, t)}
                    </span>
                    <button
                      onClick={handleNextWeekClick}
                      disabled={!canGoToNextWeek(currentWeekStart)}
                      className={`p-2 rounded-lg transition-colors ${
                        canGoToNextWeek(currentWeekStart)
                          ? "hover:bg-gray-100 cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <i
                        className={`fas fa-chevron-right ${
                          canGoToNextWeek(currentWeekStart)
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}
                      ></i>
                    </button>
                  </div>

                  {/* Weekday Names (Mon-Fri only) */}
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {[
                      t("pricing.calendar.weekDays.mon"),
                      t("pricing.calendar.weekDays.tue"),
                      t("pricing.calendar.weekDays.wed"),
                      t("pricing.calendar.weekDays.thu"),
                      t("pricing.calendar.weekDays.fri"),
                    ].map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-bold text-gray-500 p-2 underline"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Week Days */}
                  <div className="grid grid-cols-5 gap-1 mb-6">
                    {getWeekDays(currentWeekStart).map((date) => {
                      const isAvailable = isDateAvailable(date, availableDates);
                      const isSelected = isDateSelected(date, selectedDate);
                      const colorClass = getDateColorClass(
                        date,
                        isSelected,
                        isAvailable,
                        availableDates
                      );
                      const availabilityBoxColorClass =
                        getAvailabilityBoxColorClass(
                          date,
                          isAvailable,
                          availableDates
                        );

                      return (
                        <div
                          key={date.toISOString()}
                          className="relative flex flex-col items-center min-h-[52px]"
                        >
                          <motion.button
                            onClick={() => handleDateSelect(date)}
                            disabled={!isAvailable}
                            initial={{ scale: 1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className={`
                      p-2 text-center text-sm transition-all duration-600 relative w-9 h-9 rounded-full flex items-center justify-center
                      ${colorClass}`}
                          >
                            {isSelected && (
                              <motion.div
                                className="absolute inset-1 rounded-full border-brand-dark"
                                initial={{ scale: 0, borderWidth: 0 }}
                                animate={{ scale: 1, borderWidth: 1.5 }}
                                transition={{
                                  scale: { duration: 1.2, ease: "easeOut" },
                                  borderWidth: {
                                    duration: 0.8,
                                    ease: "easeOut",
                                  },
                                }}
                              />
                            )}

                            <motion.span
                              className="relative z-10"
                              initial={{ scale: 1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              {date.getDate()}
                            </motion.span>
                          </motion.button>

                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{
                              duration: 0.6,
                              ease: "easeOut",
                              delay: 0.2,
                            }}
                            style={{ transformOrigin: "bottom center" }}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-3 h-3 rounded border border-gray-200 ${availabilityBoxColorClass}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Slot Selection */}
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{
                      height: showTimeSection ? "auto" : 0,
                      opacity: showTimeSection ? 1 : 0,
                      y: showTimeSection ? 0 : -20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      height: { duration: 0.5 },
                      opacity: {
                        duration: 0.4,
                        delay: showTimeSection ? 0.2 : 0,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-300 mb-8 mt-8"></div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                      {t("pricing.calendar.selectTimeSlot")}
                    </h3>

                    {selectedDate ? (
                      <div>
                        <p className="text-sm font-normal text-gray-600 mb-4 text-center">
                          {formatDateForDisplay(selectedDate, t, language)}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {timeSlots.map((slot) => {
                            const isAvailable = availableTimeSlots.some(
                              (availableSlot) => availableSlot.id === slot.id
                            );
                            const isSelected = selectedTimeSlot?.id === slot.id;

                            return (
                              <div key={slot.id} className="relative">
                                <button
                                  onClick={() =>
                                    isAvailable && handleTimeSlotSelect(slot)
                                  }
                                  disabled={!isAvailable}
                                  className={`
                            w-full p-3 rounded transition-all duration-300 text-sm font-bold relative
                            ${
                              isAvailable
                                ? "border-gray-200 border text-gray-600 hover:bg-purple-50 hover:border-purple-100 cursor-pointer"
                                : "border-gray-200 border text-gray-400 bg-gray-50 cursor-not-allowed"
                            }`}
                                >
                                  {slot.label}

                                  {isSelected && isAvailable && (
                                    <motion.div
                                      className="absolute inset-0 border-2 border-brand-dark rounded"
                                      initial={{ scale: 0.9, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                      }}
                                    />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center text-xs font-normal">
                        {t("pricing.calendar.pleaseSelectDate")}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Payment Section - Animate in when date is selected */}
        {isPriceSelected && showPaymentSection && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{
              duration: 1.44,
              ease: "easeOut",
              delay: 0.2,
            }}
            className={`mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto border-2 transition-all duration-700 font-sans ${
              selectedDate && selectedTimeSlot
                ? "border-black shadow-lg"
                : "border-gray-100"
            }`}
            style={{
              fontFamily: "Arial, sans-serif",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.64 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("pricing.payment.title")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("pricing.payment.subtitle")}
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    id: "card",
                    label: t("pricing.payment.methods.card"),
                    icon: CreditCardIcon,
                  },
                  {
                    id: "mobilepay",
                    label: t("pricing.payment.methods.mobilepay"),
                    icon: MobilepayIcon,
                  },
                  {
                    id: "bank",
                    label: t("pricing.payment.methods.bank"),
                    icon: BankIcon,
                  },
                  {
                    id: "cash",
                    label: t("pricing.payment.methods.cash"),
                    icon: CashIcon,
                  },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() =>
                      selectedDate && selectedTimeSlot
                        ? handlePaymentMethodSelect(method.id)
                        : null
                    }
                    disabled={!(selectedDate && selectedTimeSlot)}
                    initial={{ scale: 1 }}
                    whileHover={
                      selectedDate && selectedTimeSlot ? { scale: 1.05 } : {}
                    }
                    whileTap={
                      selectedDate && selectedTimeSlot ? { scale: 0.95 } : {}
                    }
                    animate={{
                      opacity: selectedDate && selectedTimeSlot ? 1 : 0.3, // Gray when uninteractable
                      cursor:
                        selectedDate && selectedTimeSlot
                          ? "pointer"
                          : "not-allowed",
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                      selectedPaymentMethod === method.id &&
                      selectedDate &&
                      selectedTimeSlot
                        ? "border-brand-dark bg-brand-dark/10 text-brand-dark"
                        : selectedDate && selectedTimeSlot
                        ? "border-gray-200 hover:border-brand-dark/50 text-gray-600"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <img
                      src={method.icon}
                      alt={method.label}
                      className="w-8 h-8 mx-auto mb-2"
                    />
                    <div className="text-sm font-medium">{method.label}</div>
                  </motion.button>
                ))}
              </div>

              {/*  Help Tooltip  */}
              <motion.div className="relative mb-6">
                {/* Toggle Button (Arrow)*/}
                <motion.button
                  type="button"
                  onClick={() =>
                    selectedDate && selectedTimeSlot
                      ? setShowPaymentTooltip(!showPaymentTooltip)
                      : null
                  }
                  disabled={!(selectedDate && selectedTimeSlot)}
                  className="w-full text-left text-sm text-brand-dark hover:text-brand-dark/80 transition-colors duration-200 flex items-center justify-between p-2"
                >
                  <span className="flex items-center">
                    <motion.div layout className="w-4 h-4 mr-2">
                      <img src={ThinkingIcon} alt="Help" className="w-4 h-4" />
                    </motion.div>
                    <motion.span layout>
                      {t("pricing.payment.helpTooltip")}
                    </motion.span>
                  </span>
                  <motion.span
                    animate={{ rotate: showPaymentTooltip ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    ▼
                  </motion.span>
                </motion.button>

                {/* Animated container + delayed text */}
                <motion.div
                  animate={showPaymentTooltip ? "expanded" : "collapsed"}
                  variants={{
                    collapsed: {
                      height: 0,
                      opacity: 0,
                      marginTop: 0,
                      transition: { duration: 0.7, ease: "easeInOut" },
                    },
                    expanded: {
                      height: "auto",
                      opacity: 1,
                      marginTop: 12,
                      transition: {
                        duration: 0.9,
                        ease: "easeInOut",
                        when: "beforeChildren",
                      },
                    },
                  }}
                  className="overflow-hidden mt-3 rounded-lg bg-gray-50"
                  style={{
                    pointerEvents: showPaymentTooltip ? "auto" : "none",
                  }}
                >
                  <motion.p
                    animate={
                      showPaymentTooltip
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 8 }
                    }
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="p-4 text-sm text-gray-600 whitespace-pre-line"
                  >
                    {t("pricing.payment.helpContent")}
                  </motion.p>
                </motion.div>
              </motion.div>

              {/*  Payment Confirmation Button  */}
              <motion.button
                layout
                onClick={
                  selectedDate && selectedTimeSlot && selectedPaymentMethod
                    ? handlePaymentConfirmation
                    : null
                }
                disabled={
                  !(selectedDate && selectedTimeSlot && selectedPaymentMethod)
                }
                initial={{ scale: 1 }}
                whileHover={
                  selectedDate && selectedTimeSlot && selectedPaymentMethod
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  selectedDate && selectedTimeSlot && selectedPaymentMethod
                    ? { scale: 0.95 }
                    : {}
                }
                animate={{
                  backgroundColor:
                    selectedDate && selectedTimeSlot && selectedPaymentMethod
                      ? "#2563eb"
                      : "#9ca3af",
                  opacity: selectedDate && selectedTimeSlot ? 1 : 0.4,
                  cursor:
                    selectedDate && selectedTimeSlot && selectedPaymentMethod
                      ? "pointer"
                      : "not-allowed",
                }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 200,
                    damping: 30,
                    bounce: 0,
                  },
                  backgroundColor: { duration: 1.2, ease: "easeInOut" },
                  opacity: { duration: 1.2, ease: "easeInOut" },
                  scale: { duration: 0.4, ease: "easeOut" },
                }}
                className="w-4/5 mx-auto py-4 rounded-xl font-bold text-lg flex items-center justify-center text-white relative overflow-hidden"
              >
                <span className="relative z-10">
                  {selectedDate && selectedTimeSlot && selectedPaymentMethod
                    ? t("pricing.payment.confirmPayment")
                    : !(selectedDate && selectedTimeSlot)
                    ? t("pricing.payment.selectDateTime")
                    : t("pricing.payment.selectPaymentMethod")}
                </span>

                {/* Animated Wallet Icon - slides in from text end when payment method is selected */}
                {selectedDate && selectedTimeSlot && selectedPaymentMethod && (
                  <motion.img
                    src={WalletArrowIcon}
                    alt="Proceed"
                    className="w-5 h-5 ml-2 relative z-10"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}

                {/* Lock Icon for disabled state */}
                {!(
                  selectedDate &&
                  selectedTimeSlot &&
                  selectedPaymentMethod
                ) && (
                  <img
                    src={LockSlashIcon}
                    alt="Locked"
                    className="w-5 h-5 ml-6"
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PricingCalendar;
