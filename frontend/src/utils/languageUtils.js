import flagFi from "../assets/icons/flag-fi-svgrepo-com.svg";
import flagEngland from "../assets/icons/flag-england-svgrepo-com.svg";

/**
 * Centralized language configuration to avoid duplication
 * Used by both Hero and Header components
 */
export const languageOptions = [
  { code: "fi", flag: flagFi, label: "FIN", alt: "Finnish flag" },
  { code: "en", flag: flagEngland, label: "ENG", alt: "English flag" },
];

/**
 * Get current language option object
 * @param {string} currentLanguage - Current language code
 * @returns {Object} Language option object
 */
export const getCurrentLanguageOption = (currentLanguage) => {
  return languageOptions.find((option) => option.code === currentLanguage);
};
