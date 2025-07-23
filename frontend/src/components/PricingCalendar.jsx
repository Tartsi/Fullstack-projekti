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
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const timeoutRef = useRef(null);

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

  // Generate available dates (placeholder data - would come from backend)
  useEffect(() => {
    const dates = generateAvailableDates();
    setAvailableDates(dates);

    // Set default selected date to first available date that has time slots
    const firstAvailableDate = dates.find(
      (dateEntry) =>
        dateEntry.availableSlots && dateEntry.availableSlots.length > 0
    );

    if (firstAvailableDate) {
      setSelectedDate(firstAvailableDate.date);
      setAvailableTimeSlots(firstAvailableDate.availableSlots);
    } else {
      setSelectedDate(null);
      setAvailableTimeSlots([]);
    }
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
      }
    }
  }, [selectedDate, availableDates]);

  const handleDateSelect = (date) => {
    if (isDateAvailable(date, availableDates)) {
      const slots = getAvailableTimeSlotsForDate(date, availableDates);
      // Only select the date if it has available time slots
      if (slots && slots.length > 0) {
        setSelectedDate(date);
      }
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
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

  // Show confirm button when both date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      setTimeout(() => {
        setShowConfirmButton(true);
      }, 100);
    } else {
      setShowConfirmButton(false);
    }
  }, [selectedDate, selectedTimeSlot]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      // This would typically send data to backend
      const message = t("pricing.calendar.bookingConfirmation")
        .replace("{date}", formatDateForDisplay(selectedDate))
        .replace("{start}", selectedTimeSlot.start)
        .replace("{end}", selectedTimeSlot.end);
      alert(message);
    }
  };

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

    if (firstDay.getMonth() === lastDay.getMonth()) {
      return monthNames[firstDay.getMonth()];
    } else {
      return `${monthNames[firstDay.getMonth()]} / ${
        monthNames[lastDay.getMonth()]
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
      return `Week ${firstWeek}`;
    } else {
      return `Week ${firstWeek}/${lastWeek}`;
    }
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
      return `bg-white text-black font-normal border-2 border-purple-500 rounded-full w-10 h-10 flex items-center justify-center mx-auto`;
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

  // Get underline color class based on available slots count
  const getUnderlineColorClass = (date, isAvailable) => {
    if (!isAvailable) {
      return "border-gray-300";
    }

    const slotCount = getAvailableSlotCount(date);

    if (slotCount === 4) {
      return "border-green-500";
    } else if (slotCount === 3) {
      return "border-yellow-400"; // Bright yellow
    } else if (slotCount === 2) {
      return "border-orange-600"; // Dark orange
    } else if (slotCount === 1) {
      return "border-red-500";
    } else {
      return "border-gray-300";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Large centered Price Container */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{
            scale: isPriceSelected ? 1.15 : 1,
          }}
          whileHover={{ scale: isPriceSelected ? 1.15 : 1.1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
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
          <div className="p-2 mb-4 bg-gray-100 mx-auto w-1/2">
            <h2 className="text-lg font-normal text-gray-800">
              {t("pricing.title")}
            </h2>
            <div className="text-3xl text-gray-900 mb-1 font-bold">
              {t("pricing.price")}
            </div>
            <p className="text-sm text-gray-600 font-normal">
              {t("pricing.vatIncluded")}
            </p>
            <p className="text-sm text-gray-600 font-normal">
              {t("pricing.perCleaning")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <img
                src={CleaningServiceIcon}
                alt="Professional cleaning service"
                className="w-4 h-4"
              />
              <p className="text-gray-600 text-sm font-normal">
                {t("pricing.features.professional")}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <img
                src={VacuumCleanerIcon}
                alt="Scheduled at your convenience"
                className="w-4 h-4"
              />
              <p className="text-gray-600 text-sm font-normal">
                {t("pricing.features.convenient")}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <img
                src={CheckCircleIcon}
                alt="Eco-friendly cleaning products"
                className="w-4 h-4"
              />
              <p className="text-gray-600 text-sm font-normal">
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
            transition={{ duration: 2, ease: "easeOut" }}
            className="bg-white rounded-lg shadow-md border border-gray-400 p-4 mb-8 max-w-md mx-auto font-sans"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              {t("pricing.calendar.selectDate")}
            </h3>

            {/* Availability Legend */}
            <div className="mb-4 px-2">
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-gray-600">
                    {t("pricing.calendar.legend.fourSlots")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-gray-600">
                    {t("pricing.calendar.legend.threeSlots")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                  <span className="text-gray-600">
                    {t("pricing.calendar.legend.twoSlots")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
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
                const underlineColorClass = getUnderlineColorClass(
                  date,
                  isAvailable
                );

                return (
                  <motion.button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    disabled={!isAvailable}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`
                    p-2 rounded text-center text-sm transition-all duration-200 relative min-h-[2.5rem] border-b-2
                    ${colorClass} ${isSelected ? "" : underlineColorClass}
                  `}
                  >
                    {date.getDate()}
                  </motion.button>
                );
              })}
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-300 mb-6"></div>

            {/* Time Slot Selection */}
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              {t("pricing.calendar.selectTimeSlot")}
            </h3>

            {selectedDate ? (
              <div>
                <p className="text-sm font-normal text-gray-600 mb-4 text-center">
                  {formatDateForDisplay(selectedDate)}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => {
                    const isAvailable = availableTimeSlots.some(
                      (availableSlot) => availableSlot.id === slot.id
                    );
                    const isSelected = selectedTimeSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        onClick={() =>
                          isAvailable && handleTimeSlotSelect(slot)
                        }
                        disabled={!isAvailable}
                        className={`
                        p-2 rounded border transition-colors duration-300 text-xs font-normal
                        ${
                          isSelected && isAvailable
                            ? "bg-purple-100 border-purple-200 text-purple-800"
                            : isAvailable
                            ? "border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-100 cursor-pointer"
                            : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                        }
                      `}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center text-xs font-normal">
                {t("pricing.calendar.pleaseSelectDate")}
              </p>
            )}

            {/* Separator Line for Confirm Button */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Confirm Button - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.4, ease: "easeOut" }}
              className="text-center"
            >
              <motion.button
                onClick={
                  selectedDate && selectedTimeSlot ? handleConfirm : undefined
                }
                disabled={!selectedDate || !selectedTimeSlot}
                animate={{
                  width: selectedDate && selectedTimeSlot ? "100%" : "60%",
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: selectedDate && selectedTimeSlot ? 0.3 : 0,
                }}
                className={`px-6 py-3 rounded-lg font-normal text-sm transition-all duration-500 mx-auto block ${
                  selectedDate && selectedTimeSlot
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <motion.span
                  key={
                    selectedDate && selectedTimeSlot
                      ? "full-text"
                      : "placeholder"
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: selectedDate && selectedTimeSlot ? 0.8 : 0,
                  }}
                >
                  {selectedDate && selectedTimeSlot
                    ? `${t(
                        "pricing.calendar.confirmBooking"
                      )} ${selectedDate.toLocaleDateString()} ${
                        selectedTimeSlot.start
                      } - ${selectedTimeSlot.end}`
                    : t("pricing.calendar.selectDateTime")}
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PricingCalendar;
