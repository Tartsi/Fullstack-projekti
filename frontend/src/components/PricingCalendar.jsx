import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import {
  timeSlots,
  monthNames,
  dayNames,
  generateAvailableDates,
  getCalendarDays,
  isDateAvailable,
  isDateSelected,
  goToPreviousMonth,
  goToNextMonth,
  getAvailableTimeSlotsForDate,
  formatBookingConfirmation,
  formatDateForDisplay,
} from "../utils/calendarUtils";
import CleaningServiceIcon from "../assets/icons/cleaning-service-svgrepo-com.svg";
import VacuumCleanerIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import CheckCircleIcon from "../assets/icons/check-circle-svgrepo-com.svg";
import LockSlashIcon from "../assets/icons/lock-slash-svgrepo-com.svg";

/**
 * PricingCalendar component that displays a modern, minimalist calendar booking interface
 * CURRENTLY USES PLACEHOLDER DATA FOR DATES AND TIME SLOTS!
 * BACKEND FUNCTIONALITY IS NOT IMPLEMENTED YET!
 *
 * Features:
 * - Modern white-themed design with clean vertical layout
 * - Large centered price container (49€ including VAT)
 * - Date selection calendar (minimum 2 days from current date)
 * - Time slot selection (2-hour intervals from 09:00-17:00)
 * - Confirm button and booking summary
 * - Responsive design with clean typography
 * - Purple accent colors for selected states
 * - Unavailable time slots shown as disabled - maintain layout consistency
 *
 * Layout structure (top to bottom):
 * 1. Large centered price container
 * 2. Date selection calendar
 * 3. Time slot selection
 * 4. Confirm button
 * 5. Booking summary (when both date and time selected)
 *
 * @returns {JSX.Element} The rendered modern PricingCalendar component
 */
const PricingCalendar = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [isPriceSelected, setIsPriceSelected] = useState(false);
  const [showDateSection, setShowDateSection] = useState(false);
  const [showTimeSection, setShowTimeSection] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentTooltip, setShowPaymentTooltip] = useState(false);
  const timeoutRef = useRef(null);
  const sectionRef = useRef(null);

  // Get the start of the current week (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get week days (Monday to Friday only)
  const getWeekDays = (weekStart) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      // Only Monday to Friday
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Initialize current week to start of this week
  useEffect(() => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
  }, []);

  // Watch for this section to be 30% visible to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once triggered
        }
      },
      {
        threshold: 0.9, // Trigger when 80% of the section is visible
      }
    );

    // Observe this section directly for 80% visibility
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate available dates (placeholder data - would come from backend)
  useEffect(() => {
    const dates = generateAvailableDates();
    setAvailableDates(dates);

    // Don't auto-select any date - let user choose
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAvailableTimeSlots([]);
  }, []);

  // Update available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlotsForDate(selectedDate, availableDates);
      setAvailableTimeSlots(slots);
      setSelectedTimeSlot(null); // Reset time selection

      // If the selected date no longer has available slots, deselect it
      if (!slots || slots.length === 0) {
        setSelectedDate(null);
        setShowTimeSection(false);
      }
    } else {
      setShowTimeSection(false);
    }
  }, [selectedDate, availableDates]);

  const handleDateSelect = (date) => {
    if (isDateAvailable(date, availableDates)) {
      const slots = getAvailableTimeSlotsForDate(date, availableDates);
      // Only select the date if it has available time slots
      if (slots && slots.length > 0) {
        setSelectedDate(date);
        // Animate time section in after a short delay
        setTimeout(() => {
          setShowTimeSection(true);
        }, 300);
      }
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle booking confirmation
  const handleBookingConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      setShowPaymentSection(true);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Handle final payment
  const handlePayment = () => {
    if (selectedPaymentMethod) {
      const message = t("pricing.calendar.bookingConfirmation")
        .replace("{date}", formatDateForDisplay(selectedDate))
        .replace("{start}", selectedTimeSlot.start)
        .replace("{end}", selectedTimeSlot.end);
      alert(message + ` Payment method: ${selectedPaymentMethod}`);

      // Reset all selections
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setShowTimeSection(false);
      setIsPriceSelected(false);
      setShowDateSection(false);
      setShowPaymentSection(false);
      setSelectedPaymentMethod(null);
    }
  };

  const handlePriceSelect = () => {
    setIsPriceSelected(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Trigger date section animation after a short delay
    timeoutRef.current = setTimeout(() => {
      setShowDateSection(true);
    }, 100);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Get current month name for display
  const getCurrentMonthName = () => {
    const weekDays = getWeekDays(currentWeekStart);
    const firstDay = weekDays[0];
    const lastDay = weekDays[4];

    const monthTranslations = [
      t("pricing.calendar.months.january"),
      t("pricing.calendar.months.february"),
      t("pricing.calendar.months.march"),
      t("pricing.calendar.months.april"),
      t("pricing.calendar.months.may"),
      t("pricing.calendar.months.june"),
      t("pricing.calendar.months.july"),
      t("pricing.calendar.months.august"),
      t("pricing.calendar.months.september"),
      t("pricing.calendar.months.october"),
      t("pricing.calendar.months.november"),
      t("pricing.calendar.months.december"),
    ];

    if (firstDay.getMonth() === lastDay.getMonth()) {
      return monthTranslations[firstDay.getMonth()];
    } else {
      return `${monthTranslations[firstDay.getMonth()]} / ${
        monthTranslations[lastDay.getMonth()]
      }`;
    }
  };

  // Check if current week has any available dates
  const hasAvailableDatesInWeek = (weekStart) => {
    const weekDays = getWeekDays(weekStart);
    return weekDays.some((date) => isDateAvailable(date, availableDates));
  };

  // Check if we can go to previous week (has available dates)
  const canGoToPreviousWeek = () => {
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    return hasAvailableDatesInWeek(previousWeekStart);
  };

  // Check if we can go to next week (within one month limit)
  const canGoToNextWeek = () => {
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);

    // Check if any day in the next week is within the one-month limit
    const nextWeekDays = getWeekDays(nextWeekStart);
    return nextWeekDays.some((date) => date <= oneMonthFromToday);
  };

  // Get week number for a given date
  const getWeekNumber = (date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // Get week display text
  const getWeekDisplayText = () => {
    const weekDays = getWeekDays(currentWeekStart);
    const firstDay = weekDays[0];
    const lastDay = weekDays[4];

    const firstWeek = getWeekNumber(firstDay);
    const lastWeek = getWeekNumber(lastDay);

    if (firstWeek === lastWeek) {
      return `${t("pricing.calendar.week")} ${firstWeek}`;
    } else {
      return `${t("pricing.calendar.week")} ${firstWeek}/${lastWeek}`;
    }
  };

  // Format date for display with translations
  const formatDateForDisplay = (date) => {
    if (!date) return "";

    const dayNames = [
      t("pricing.calendar.weekDays.sun") || "Sunday",
      t("pricing.calendar.weekDays.mon") || "Monday",
      t("pricing.calendar.weekDays.tue") || "Tuesday",
      t("pricing.calendar.weekDays.wed") || "Wednesday",
      t("pricing.calendar.weekDays.thu") || "Thursday",
      t("pricing.calendar.weekDays.fri") || "Friday",
      t("pricing.calendar.weekDays.sat") || "Saturday",
    ];

    const monthTranslations = [
      t("pricing.calendar.months.january"),
      t("pricing.calendar.months.february"),
      t("pricing.calendar.months.march"),
      t("pricing.calendar.months.april"),
      t("pricing.calendar.months.may"),
      t("pricing.calendar.months.june"),
      t("pricing.calendar.months.july"),
      t("pricing.calendar.months.august"),
      t("pricing.calendar.months.september"),
      t("pricing.calendar.months.october"),
      t("pricing.calendar.months.november"),
      t("pricing.calendar.months.december"),
    ];

    const targetDate = new Date(date);
    const dayName = dayNames[targetDate.getDay()];
    const monthName = monthTranslations[targetDate.getMonth()];
    const day = targetDate.getDate();
    const year = targetDate.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  // Get available time slots count for a specific date
  const getAvailableSlotCount = (date) => {
    const slots = getAvailableTimeSlotsForDate(date, availableDates);
    return slots.length;
  };

  // Get color class based on available slots count
  const getDateColorClass = (date, isSelected, isAvailable) => {
    if (!isAvailable) {
      return "text-gray-300 cursor-not-allowed";
    }

    if (isSelected) {
      return `bg-white text-black font-normal rounded-full w-10 h-10 flex items-center justify-center mx-auto`;
    }

    const slotCount = getAvailableSlotCount(date);

    if (slotCount === 4) {
      return "text-black hover:bg-gray-100 cursor-pointer";
    } else if (slotCount === 3) {
      return "text-black hover:bg-gray-100 cursor-pointer";
    } else if (slotCount === 2) {
      return "text-black hover:bg-gray-100 cursor-pointer";
    } else if (slotCount === 1) {
      return "text-black hover:bg-gray-100 cursor-pointer";
    } else {
      return "hover:bg-gray-100 text-gray-700 cursor-pointer";
    }
  };

  // Get color class for the availability box under each date
  const getAvailabilityBoxColorClass = (date, isAvailable) => {
    if (!isAvailable) {
      return "bg-gray-200";
    }

    const slotCount = getAvailableSlotCount(date);

    if (slotCount === 4) {
      return "bg-green-200";
    } else if (slotCount === 3) {
      return "bg-yellow-200"; // Bright yellow
    } else if (slotCount === 2) {
      return "bg-orange-200"; // Dark orange
    } else if (slotCount === 1) {
      return "bg-red-200";
    } else {
      return "bg-gray-200";
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      data-pricing-section
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Large centered Price Container */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{
            scale: isPriceSelected ? 1.12 : 1,
          }}
          whileHover={{ scale: isPriceSelected ? 1.12 : 1.1 }}
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
          <div className="border-t border-gray-300 my-4"></div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 flex justify-center">
                <img
                  src={CleaningServiceIcon}
                  alt="Professional cleaning service"
                  className="w-4 h-4"
                />
              </div>
              <p className="text-gray-600 text-sm font-normal text-center flex-1">
                {t("pricing.features.professional")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 flex justify-center ">
                <img
                  src={VacuumCleanerIcon}
                  alt="Scheduled at your convenience"
                  className="w-4 h-4"
                />
              </div>
              <p className="text-gray-600 text-sm font-normal text-center flex-1">
                {t("pricing.features.convenient")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 flex justify-center">
                <img
                  src={CheckCircleIcon}
                  alt="Eco-friendly cleaning products"
                  className="w-4 h-4"
                />
              </div>
              <p className="text-gray-600 text-sm font-normal text-center flex-1">
                {t("pricing.features.ecoFriendly")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Date Selection Calendar */}
        {isPriceSelected && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={
              showDateSection
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 50, scale: 0.9 }
            }
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white rounded-lg shadow-md border border-gray-400 p-4 mt-16 max-w-md mx-auto font-sans"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
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
                {getCurrentMonthName()}
              </span>
            </div>

            {/* Week Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePreviousWeek}
                disabled={!canGoToPreviousWeek()}
                className={`p-2 rounded-lg transition-colors ${
                  canGoToPreviousWeek()
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <i
                  className={`fas fa-chevron-left ${
                    canGoToPreviousWeek() ? "text-gray-600" : "text-gray-300"
                  }`}
                ></i>
              </button>
              <span className="text-xs text-gray-500 font-bold">
                {getWeekDisplayText()}
              </span>
              <button
                onClick={handleNextWeek}
                disabled={!canGoToNextWeek()}
                className={`p-2 rounded-lg transition-colors ${
                  canGoToNextWeek()
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <i
                  className={`fas fa-chevron-right ${
                    canGoToNextWeek() ? "text-gray-600" : "text-gray-300"
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
                  isAvailable
                );
                const availabilityBoxColorClass = getAvailabilityBoxColorClass(
                  date,
                  isAvailable
                );

                return (
                  <div
                    key={date.toISOString()}
                    className="flex flex-col items-center"
                  >
                    <motion.button
                      onClick={() => handleDateSelect(date)}
                      disabled={!isAvailable}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: isSelected ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className={`
                      p-2 text-center text-sm transition-all duration-600 relative w-10 h-10 rounded-full flex items-center justify-center
                      ${colorClass}
                    `}
                    >
                      {/* Circle expanding animation for selected date - brand-dark color */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-brand-dark"
                          initial={{
                            scale: 0,
                            borderWidth: 0,
                          }}
                          animate={{
                            scale: 1,
                            borderWidth: 2,
                          }}
                          transition={{
                            scale: { duration: 1.2, ease: "easeOut" },
                            borderWidth: { duration: 0.8, ease: "easeOut" },
                          }}
                        />
                      )}

                      <span className="relative z-10">{date.getDate()}</span>
                    </motion.button>

                    {/* Availability indicator box - smaller size matching legend */}
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      className={`w-3 h-3 mt-1 rounded border border-gray-200 ${availabilityBoxColorClass}`}
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
                opacity: { duration: 0.4, delay: showTimeSection ? 0.2 : 0 },
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-300 mb-6 mt-6"></div>

              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                {t("pricing.calendar.selectTimeSlot")}
              </h3>

              {selectedDate ? (
                <div>
                  <p className="text-sm font-normal text-gray-600 mb-4 text-center">
                    {formatDateForDisplay(selectedDate)}
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
                            }
                          `}
                          >
                            {slot.label}

                            {/* Animated border for selection - proper expanding border */}
                            {isSelected && isAvailable && (
                              <motion.div
                                className="absolute inset-0 border-2 border-brand-dark rounded"
                                initial={{
                                  scale: 0.9,
                                  opacity: 0,
                                }}
                                animate={{
                                  scale: 1,
                                  opacity: 1,
                                }}
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
        )}

        {/* CTA Button - Outside of calendar container, always visible when calendar is visible */}
        {isPriceSelected && showDateSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={
                selectedDate && selectedTimeSlot
                  ? handleBookingConfirm
                  : undefined
              }
              disabled={!(selectedDate && selectedTimeSlot)}
              initial={{ scale: 1 }}
              animate={{
                backgroundColor:
                  selectedDate && selectedTimeSlot ? "#10b981" : "#9ca3af",
                scale: selectedDate && selectedTimeSlot ? 1.1 : 1,
              }}
              whileHover={
                selectedDate && selectedTimeSlot ? { scale: 1.15 } : {}
              }
              transition={{
                backgroundColor: { duration: 0.6, ease: "easeInOut" },
                scale: { duration: 0.36, ease: "easeInOut" },
              }}
              className={`inline-flex items-center justify-center w-80 py-4 font-cottage font-medium
               text-lg rounded-xl shadow-lg transition-all duration-600 ${
                 selectedDate && selectedTimeSlot
                   ? "text-white cursor-pointer hover:shadow-xl"
                   : "text-gray-500 cursor-not-allowed"
               }`}
            >
              <img
                src={
                  selectedDate && selectedTimeSlot
                    ? CheckCircleIcon
                    : LockSlashIcon
                }
                alt={
                  selectedDate && selectedTimeSlot
                    ? "Confirm booking"
                    : "Selection locked"
                }
                className="w-6 h-6 mr-3"
              />
              <span>
                {selectedDate && selectedTimeSlot
                  ? t("explanation.cta")
                  : t("pricing.calendar.selectDateTime")}
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Payment Section - Appears after CTA button is clicked */}
        {showPaymentSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-cottage font-bold text-gray-800 mb-2">
                Maksu
              </h3>
              <p className="text-gray-600 text-sm">
                Valitse maksutapa varauksen viimeistelemiseksi
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { id: "card", label: "Kortti", icon: "💳" },
                { id: "mobilepay", label: "MobilePay", icon: "📱" },
                { id: "bank", label: "Pankki", icon: "🏦" },
                { id: "cash", label: "Käteinen", icon: "💵" },
              ].map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    selectedPaymentMethod === method.id
                      ? "border-brand-dark bg-brand-dark/10 text-brand-dark"
                      : "border-gray-200 hover:border-brand-dark/50 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-sm font-medium">{method.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Help Tooltip */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowPaymentTooltip(!showPaymentTooltip)}
                className="w-full text-left text-sm text-brand-dark hover:text-brand-dark/80 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Tarvitsetko apua maksussa? 🤔</span>
                <span
                  className={`transition-transform duration-200 ${
                    showPaymentTooltip ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {showPaymentTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600"
                >
                  Placeholder: Tässä näkyy maksuohje ja yhteystiedot
                  tarvittaessa. Voit maksaa heti tai paikan päällä palvelun
                  jälkeen.
                </motion.div>
              )}
            </div>

            {/* Payment Confirmation Button */}
            <motion.button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod}
              initial={{ scale: 1 }}
              whileHover={selectedPaymentMethod ? { scale: 1.05 } : {}}
              whileTap={selectedPaymentMethod ? { scale: 0.95 } : {}}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedPaymentMethod
                  ? "bg-brand-dark text-white hover:bg-brand-dark/90 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedPaymentMethod ? "Vahvista Maksu" : "Valitse Maksutapa"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PricingCalendar;
