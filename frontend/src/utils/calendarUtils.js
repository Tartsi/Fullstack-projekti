// Calendar utility functions and constants

// Time slots for booking (2-hour intervals from 09:00-17:00)
export const timeSlots = [
  { id: 1, start: "09:00", end: "11:00", label: "09:00 - 11:00" },
  { id: 2, start: "11:00", end: "13:00", label: "11:00 - 13:00" },
  { id: 3, start: "13:00", end: "15:00", label: "13:00 - 15:00" },
  { id: 4, start: "15:00", end: "17:00", label: "15:00 - 17:00" },
];

// Month names
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Day names
export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Generate placeholder available dates (would come from backend in real implementation)
export const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();

  // Generate dates for the next 30 days
  for (let i = 2; i <= 31; i++) {
    // Start from 2 days ahead
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Randomly assign available slots (placeholder logic)
      const availableSlotCount = Math.floor(Math.random() * 5); // 0-4 slots
      const availableSlots = timeSlots.slice(0, availableSlotCount);

      dates.push({
        date: date,
        availableSlots: availableSlots,
      });
    }
  }

  return dates;
};

// Get calendar days for a given month (not currently used but kept for compatibility)
export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

// Check if a date is available (has at least one available time slot)
export const isDateAvailable = (date, availableDates) => {
  if (!date || !availableDates) return false;

  const dateEntry = availableDates.find((availableDate) => {
    const targetDate = new Date(date);
    const compareDate = new Date(availableDate.date);

    return (
      targetDate.getFullYear() === compareDate.getFullYear() &&
      targetDate.getMonth() === compareDate.getMonth() &&
      targetDate.getDate() === compareDate.getDate()
    );
  });

  // Return true only if the date exists AND has at least one available time slot
  return (
    dateEntry && dateEntry.availableSlots && dateEntry.availableSlots.length > 0
  );
};

// Check if a date is selected
export const isDateSelected = (date, selectedDate) => {
  if (!date || !selectedDate) return false;

  const targetDate = new Date(date);
  const compareDate = new Date(selectedDate);

  return (
    targetDate.getFullYear() === compareDate.getFullYear() &&
    targetDate.getMonth() === compareDate.getMonth() &&
    targetDate.getDate() === compareDate.getDate()
  );
};

// Go to previous month (not currently used but kept for compatibility)
export const goToPreviousMonth = (currentDate) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

// Go to next month (not currently used but kept for compatibility)
export const goToNextMonth = (currentDate) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
};

// Get available time slots for a specific date
export const getAvailableTimeSlotsForDate = (date, availableDates) => {
  if (!date || !availableDates) return [];

  const targetDate = new Date(date);
  const dateEntry = availableDates.find((availableDate) => {
    const compareDate = new Date(availableDate.date);
    return (
      targetDate.getFullYear() === compareDate.getFullYear() &&
      targetDate.getMonth() === compareDate.getMonth() &&
      targetDate.getDate() === compareDate.getDate()
    );
  });

  return dateEntry ? dateEntry.availableSlots : [];
};

// Format booking confirmation message
export const formatBookingConfirmation = (date, timeSlot) => {
  if (!date || !timeSlot) return "";

  const formattedDate = formatDateForDisplay(date);
  return `Booking confirmed for ${formattedDate} from ${timeSlot.start} to ${timeSlot.end}`;
};

// Format date for display
export const formatDateForDisplay = (date) => {
  if (!date) return "";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};
