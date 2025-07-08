import React, { createContext, useContext, useState } from "react";
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

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (path) => {
    const keys = path.split(".");
    let value = translations[language];

    for (const key of keys) {
      if (value && typeof value === "object") {
        value = value[key];
      } else {
        return path; // Return path if translation not found
      }
    }

    return value || path;
  };

  const value = {
    language,
    changeLanguage,
    t, // Translation function
    availableLanguages: Object.keys(translations),
  };

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
