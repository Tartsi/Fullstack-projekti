import React, { createContext, useContext, useState } from "react";
import { translations } from "./translations.js";

// Language Context
const LanguageContext = createContext();

// Language Provider Component
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
