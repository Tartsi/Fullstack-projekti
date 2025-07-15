import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { translations } from "./translations.js";

// Language Context
const LanguageContext = createContext();

/**
 * LanguageProvider component that provides language context to its children.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 *
 * @returns {JSX.Element} A context provider that supplies language-related functionality.
 *
 * @property {string} language - The current language code (default is "fi").
 * @property {function} changeLanguage - Function to change the current language.
 * @property {function} t - Translation function that retrieves the translation for a given path.
 * @property {string[]} availableLanguages - Array of available language codes.
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("fi"); // Default to Finnish

  /**
   * Optimized language change function with validation
   * Uses useCallback to prevent unnecessary re-renders
   */
  const changeLanguage = useCallback(
    (newLanguage) => {
      if (translations[newLanguage] && newLanguage !== language) {
        setLanguage(newLanguage);
      }
    },
    [language]
  );

  /**
   * Optimized translation function with better error handling
   * Uses useCallback for performance optimization
   */
  const t = useCallback(
    (path) => {
      const keys = path.split(".");
      let value = translations[language];

      for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          // Better fallback - try English if current language fails
          if (language !== "en") {
            let fallbackValue = translations.en;
            for (const fallbackKey of keys) {
              if (
                fallbackValue &&
                typeof fallbackValue === "object" &&
                fallbackKey in fallbackValue
              ) {
                fallbackValue = fallbackValue[fallbackKey];
              } else {
                return path; // Return path if both current and fallback fail
              }
            }
            return fallbackValue;
          }
          return path; // Return path if translation not found
        }
      }

      return value || path;
    },
    [language]
  );

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Only recreates when language changes
   */
  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      t, // Translation function
      availableLanguages: Object.keys(translations),
    }),
    [language, changeLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
