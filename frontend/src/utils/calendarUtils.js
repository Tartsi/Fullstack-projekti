// Calendar utility functions and constants for the PricingCalendar component

// Time slots for booking (2-hour intervals from 09:00-17:00)
export const timeSlots = [
  { id: 1, start: "09:00", end: "11:00", label: "09:00 - 11:00" },
  { id: 2, start: "11:00", end: "13:00", label: "11:00 - 13:00" },
  { id: 3, start: "13:00", end: "15:00", label: "13:00 - 15:00" },
  { id: 4, start: "15:00", end: "17:00", label: "15:00 - 17:00" },
];

// Get the start of the current week (Monday)
export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Get week days (Monday to Friday only)
export const getWeekDays = (weekStart) => {
  const days = [];
  for (let i = 0; i < 5; i++) {
    // Only Monday to Friday
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
};

// Handle week navigation
export const handlePreviousWeek = (currentWeekStart) => {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() - 7);
  return newWeekStart;
};

export const handleNextWeek = (currentWeekStart) => {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() + 7);
  return newWeekStart;
};

// Check if we can go to previous week (has available dates)
export const canGoToPreviousWeek = (currentWeekStart, availableDates) => {
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const weekDays = getWeekDays(previousWeekStart);
  return weekDays.some((date) => isDateAvailable(date, availableDates));
};

// Check if we can go to next week (within one month limit)
export const canGoToNextWeek = (currentWeekStart) => {
  const today = new Date();
  const oneMonthFromToday = new Date(today);
  oneMonthFromToday.setMonth(today.getMonth() + 1);

  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(currentWeekStart.getDate() + 7);

  // Check if any day in the next week is within the one-month limit
  const nextWeekDays = getWeekDays(nextWeekStart);
  return nextWeekDays.some((date) => date <= oneMonthFromToday);
};

// Get week number for a given date (used by getWeekDisplayText)
export const getWeekNumber = (date) => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Get week display text
export const getWeekDisplayText = (currentWeekStart, t) => {
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

// Get current month name for display
export const getCurrentMonthName = (currentWeekStart, t) => {
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

// Get available time slots count for a specific date (used by color functions)
export const getAvailableSlotCount = (date, availableDates) => {
  const slots = getAvailableTimeSlotsForDate(date, availableDates);
  return slots.length;
};

// Get color class based on available slots count
export const getDateColorClass = (
  date,
  isSelected,
  isAvailable,
  availableDates
) => {
  if (!isAvailable) {
    return "text-gray-300 cursor-not-allowed";
  }

  if (isSelected) {
    return `bg-white text-black font-normal rounded-full w-10 h-10 flex items-center justify-center mx-auto`;
  }

  const slotCount = getAvailableSlotCount(date, availableDates);

  if (slotCount >= 1) {
    return "text-black hover:bg-gray-100 cursor-pointer";
  } else {
    return "hover:bg-gray-100 text-gray-700 cursor-pointer";
  }
};

// Get color class for the availability box under each date
export const getAvailabilityBoxColorClass = (
  date,
  isAvailable,
  availableDates
) => {
  if (!isAvailable) {
    return "bg-gray-200";
  }

  const slotCount = getAvailableSlotCount(date, availableDates);

  if (slotCount === 4) {
    return "bg-green-200";
  } else if (slotCount === 3) {
    return "bg-yellow-200";
  } else if (slotCount === 2) {
    return "bg-orange-200";
  } else if (slotCount === 1) {
    return "bg-red-200";
  } else {
    return "bg-gray-200";
  }
};

// Generate placeholder available dates (TODO: Replace with API call)
export const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();

  // Generate dates for the next 30 days with minimum 2-day booking window
  for (let i = 2; i <= 31; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Business rule: Only weekdays (Monday-Friday)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Randomly assign available slots (placeholder logic)
      const availableSlotCount = Math.floor(Math.random() * 5); // 0-4 slots
      const availableSlots = timeSlots.slice(0, availableSlotCount);

      // Validate date before adding
      if (date instanceof Date && !isNaN(date)) {
        dates.push({
          date: date,
          availableSlots: availableSlots,
        });
      }
    }
  }

  return dates;
};

// Check if a date is available (has at least one available time slot)
export const isDateAvailable = (date, availableDates) => {
  if (!date || !availableDates || !(date instanceof Date) || isNaN(date)) {
    return false;
  }

  const dateEntry = availableDates.find((availableDate) => {
    if (!availableDate || !availableDate.date) return false;

    const targetDate = new Date(date);
    const compareDate = new Date(availableDate.date);

    // Validate both dates are valid
    if (!(compareDate instanceof Date) || isNaN(compareDate)) return false;

    return (
      targetDate.getFullYear() === compareDate.getFullYear() &&
      targetDate.getMonth() === compareDate.getMonth() &&
      targetDate.getDate() === compareDate.getDate()
    );
  });

  // Return true only if the date exists AND has at least one available time slot
  return (
    dateEntry &&
    dateEntry.availableSlots &&
    Array.isArray(dateEntry.availableSlots) &&
    dateEntry.availableSlots.length > 0
  );
};

// Check if a date is selected
export const isDateSelected = (date, selectedDate) => {
  if (
    !date ||
    !selectedDate ||
    !(date instanceof Date) ||
    !(selectedDate instanceof Date)
  ) {
    return false;
  }

  if (isNaN(date) || isNaN(selectedDate)) {
    return false;
  }

  const targetDate = new Date(date);
  const compareDate = new Date(selectedDate);

  return (
    targetDate.getFullYear() === compareDate.getFullYear() &&
    targetDate.getMonth() === compareDate.getMonth() &&
    targetDate.getDate() === compareDate.getDate()
  );
};

// Get available time slots for a specific date
export const getAvailableTimeSlotsForDate = (date, availableDates) => {
  if (!date || !availableDates || !(date instanceof Date) || isNaN(date)) {
    return [];
  }

  if (!Array.isArray(availableDates)) {
    return [];
  }

  const targetDate = new Date(date);
  const dateEntry = availableDates.find((availableDate) => {
    if (!availableDate || !availableDate.date) return false;

    const compareDate = new Date(availableDate.date);
    if (!(compareDate instanceof Date) || isNaN(compareDate)) return false;

    return (
      targetDate.getFullYear() === compareDate.getFullYear() &&
      targetDate.getMonth() === compareDate.getMonth() &&
      targetDate.getDate() === compareDate.getDate()
    );
  });

  return dateEntry && Array.isArray(dateEntry.availableSlots)
    ? dateEntry.availableSlots
    : [];
};

// Format date for display with localization support
export const formatDateForDisplay = (date, t, language = "fi") => {
  if (!date) return "";

  const weekdayNames = {
    fi: [
      t("pricing.calendar.weekDays.sun"),
      t("pricing.calendar.weekDays.mon"),
      t("pricing.calendar.weekDays.tue"),
      t("pricing.calendar.weekDays.wed"),
      t("pricing.calendar.weekDays.thu"),
      t("pricing.calendar.weekDays.fri"),
      t("pricing.calendar.weekDays.sat"),
    ],
    en: [
      t("pricing.calendar.weekDays.sun"),
      t("pricing.calendar.weekDays.mon"),
      t("pricing.calendar.weekDays.tue"),
      t("pricing.calendar.weekDays.wed"),
      t("pricing.calendar.weekDays.thu"),
      t("pricing.calendar.weekDays.fri"),
      t("pricing.calendar.weekDays.sat"),
    ],
  };

  const monthNames = {
    fi: [
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
    ],
    en: [
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
    ],
  };

  const dateObj = new Date(date);
  const weekday =
    weekdayNames[language]?.[dateObj.getDay()] ||
    weekdayNames.fi[dateObj.getDay()];
  const month =
    monthNames[language]?.[dateObj.getMonth()] ||
    monthNames.fi[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${weekday}, ${day}. ${month} ${year}`;
};
