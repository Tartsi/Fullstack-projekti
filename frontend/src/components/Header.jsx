import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  languageOptions,
  getCurrentLanguageOption,
} from "../utils/languageUtils";
import { scrollAnimations } from "../utils/scrollUtils";

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
   * Toggle hamburger menu visibility
   */
  const toggleHamburgerMenu = useCallback(() => {
    setIsHovered(!isHovered);
  }, [isHovered]);

  /**
   * Toggle language menu visibility
   */
  const toggleLanguageMenu = useCallback(() => {
    setIsLanguageHovered(!isLanguageHovered);
  }, [isLanguageHovered]);

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
    scrollAnimations.medium("about");
  }, []);

  /**
   * Scroll to the explanation section (process)
   */
  const scrollToProcess = useCallback(() => {
    scrollAnimations.medium("explanation");
  }, []);

  /**
   * Scroll to the services section (pricing calendar) with proper positioning
   * Shows the services title and makes pricing selectable while keeping reviews visible
   * Uses ultra-slow scrolling on large screens for better UX
   */
  const scrollToServices = useCallback(() => {
    // Use ultra-slow scrolling on large screens for better UX
    if (window.innerHeight >= 1024) {
      scrollAnimations.ultraSlow("pricing");
    } else {
      scrollAnimations.medium("pricing");
    }
  }, []);

  /**
   * Scroll to the contact section (footer) with ultra-slow animation on large screens
   */
  const scrollToContact = useCallback(() => {
    // Use ultra-slow scrolling on large screens for better UX
    if (window.innerHeight >= 1024) {
      scrollAnimations.ultraSlow("footer");
    } else {
      scrollAnimations.medium("footer");
    }
  }, []);

  // Navigation items to reduce repetition
  const navItems = [
    { key: "about", onClick: scrollToAbout },
    { key: "process", onClick: scrollToProcess },
    { key: "order", onClick: scrollToServices },
    { key: "contact", onClick: scrollToContact },
  ];

  // Common CSS classes for hover effects - Responsive text sizing
  const navItemClasses =
    "block cursor-pointer hover:opacity-100 hover:scale-110 hover:underline opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-[10px] xs:text-xs sm:text-xs md:text-sm";

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } text-black`}
    >
      <div
        className={`w-full flex justify-between items-center px-4 sm:px-6 md:px-8 transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Language Selector */}
        <div
          className="flex items-center relative"
          onMouseEnter={() => setIsLanguageHovered(true)}
          onMouseLeave={() => setIsLanguageHovered(false)}
        >
          {/* Hover Zone for Language Menu */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-0 w-80 h-16 transition-all duration-700 z-40 ${
              isLanguageHovered ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />

          {/* Language Hover Menu - Dropped by 3.5% */}
          <div
            className={`absolute top-[53.5%] -translate-y-1/2 left-16 text-xs sm:text-sm font-light tracking-wide uppercase transition-all duration-700 z-50
                                            ${
                                              isLanguageHovered
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 -translate-x-4 pointer-events-none"
                                            }`}
          >
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-3 py-3 text-black bg-white border-2 border-black rounded-lg shadow-lg">
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
            onClick={toggleLanguageMenu}
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

        {/* Navigation Menu*/}
        <div
          className="flex items-center relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hover Zone for Hamburger Menu - Responsive width */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-0 w-72 xs:w-80 sm:w-96 h-16 transition-all duration-700 z-40 ${
              isHovered ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />

          {/* Hover-menu - Responsive positioning and scaling */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-8 xs:right-10 sm:right-12 transition-all duration-700 z-50
                                            ${
                                              isHovered
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-4 pointer-events-none"
                                            }`}
          >
            <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-2 xs:px-3 py-3 text-black bg-white border-2 border-black rounded-lg shadow-lg text-xs xs:text-xs sm:text-sm font-light tracking-wide uppercase">
              {navItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  {item.separated && index > 0 && (
                    <div className="w-px h-4 xs:h-5 sm:h-6 bg-black mx-1 xs:mx-2"></div>
                  )}
                  <span onClick={item.onClick} className={navItemClasses}>
                    {t(`nav.${item.key}`)}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Hamburger-symbol */}
          <div
            onClick={toggleHamburgerMenu}
            className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-thin cursor-pointer select-none leading-none -mt-2 relative z-10"
          >
            ≡
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
