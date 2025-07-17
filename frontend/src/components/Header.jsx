import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  languageOptions,
  getCurrentLanguageOption,
} from "../utils/languageUtils";

/**
 * Header component that displays a minimal fixed navigation at the top of the page.
 * It includes only a hamburger menu and a language selector.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component.
 *
 * @description
 * - The header is fixed at the top of the viewport with no background color.
 * - A hoverable navigation link-menu is displayed when the user hovers over the hamburger icon on the Header's right side.
 * - The visibility and position of the menu are animated using CSS transitions.
 * - A language selector is included on the left side, allowing users to switch between Finnish and English.
 * - Language changes trigger animations for visual feedback.
 * - Clean, minimal design without background or company branding.
 */
const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLanguageHovered, setIsLanguageHovered] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, changeLanguage, t } = useLanguage();

  /**
   * Optimized scroll handler using useCallback to prevent unnecessary re-renders
   */
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const heroHeight = window.innerHeight;
    setIsScrolled(scrollPosition > heroHeight * 0.8); // Show header after scrolling 80% of hero height
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /**
   * Handles the language change process by updating the current language
   * and triggering a temporary animation state.
   * Added optimization to prevent unnecessary state changes
   *
   * @param {string} newLanguage - The new language to switch to.
   * @returns {void}
   */
  const handleLanguageChange = useCallback(
    (newLanguage) => {
      if (newLanguage !== language) {
        setIsLanguageChanging(true);
        changeLanguage(newLanguage);
        // Reset animation after a short delay
        setTimeout(() => {
          setIsLanguageChanging(false);
        }, 600);
      }
    },
    [language, changeLanguage]
  );

  /**
   * Enhanced scroll to the about section using centralized utility
   */
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      // Use the centralized scroll utility
      import("../utils/scrollUtils").then(({ scrollAnimations }) => {
        scrollAnimations.medium("about");
      });
    }
  }, []);

  // Navigation items to reduce repetition
  const navItems = [
    { key: "about", onClick: scrollToAbout },
    { key: "services", onClick: null },
    { key: "order", onClick: null },
    { key: "contact", onClick: null },
  ];

  // Common CSS classes for hover effects
  const navItemClasses =
    "block cursor-pointer hover:opacity-100 hover:scale-110 hover:underline opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-xs sm:text-xs md:text-sm";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } text-black`}
    >
      <div
        className={`w-full flex justify-between items-center px-4 sm:px-6 md:px-8 transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Language Selector - Left */}
        <div
          className="flex items-center"
          onMouseEnter={() => setIsLanguageHovered(true)}
          onMouseLeave={() => setIsLanguageHovered(false)}
        >
          {/* Language Hover Menu */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-0 text-xs sm:text-sm font-light tracking-wide uppercase transition-all duration-700
                                            ${
                                              isLanguageHovered
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 -translate-x-4 pointer-events-none"
                                            }`}
          >
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-3 sm:px-4 md:px-5 lg:px-6 py-4 text-black pl-16 sm:pl-18 md:pl-22 lg:pl-24">
              {languageOptions.map((option) => (
                <div
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  className={`flex flex-col items-center cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium ${
                    language === option.code
                      ? "opacity-100 font-medium text-gray-900"
                      : ""
                  }`}
                >
                  <img
                    src={option.flag}
                    alt={option.alt}
                    className="w-4 h-3 sm:w-5 sm:h-4 md:w-6 md:h-4 mb-1 rounded-sm"
                  />
                  <span className="text-xs sm:text-xs md:text-sm">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Toggle Button */}
          <div
            className={`flex items-center space-x-1 text-xs sm:text-sm font-cottage italic hover:opacity-100 opacity-70 transition-all duration-200 cursor-pointer select-none ${
              isLanguageChanging
                ? "scale-110 text-brand-purple opacity-100"
                : "scale-100"
            }`}
          >
            {(() => {
              const currentLang = getCurrentLanguageOption(language);
              return (
                <>
                  <img
                    src={currentLang?.flag}
                    alt={currentLang?.alt}
                    className="w-4 h-3 sm:w-5 sm:h-4 rounded-sm"
                  />
                  <span className="uppercase tracking-wide">
                    {currentLang?.label}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        {/* Navigation Menu - Right */}
        <div
          className="flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hover-menu */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-0 text-xs sm:text-sm font-light tracking-wide uppercase transition-all duration-700
                                            ${
                                              isHovered
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-4 pointer-events-none"
                                            }`}
          >
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-3 sm:px-4 md:px-5 lg:px-6 py-4 text-black pr-16 sm:pr-18 md:pr-20 lg:pr-24">
              {navItems.map((item) => (
                <span
                  key={item.key}
                  onClick={item.onClick}
                  className={navItemClasses}
                >
                  {t(`nav.${item.key}`)}
                </span>
              ))}
            </div>
          </div>

          {/* Hamburger-symbol */}
          <div className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-thin cursor-pointer select-none leading-none -mt-2 relative z-10">
            ≡
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
