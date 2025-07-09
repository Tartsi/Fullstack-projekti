import React, { useState, useEffect } from "react";
import carIcon from "../assets/icons/car-salesman-service-svgrepo-com.svg";
import vacuumIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import flagFi from "../assets/icons/flag-fi-svgrepo-com.svg";
import flagEngland from "../assets/icons/flag-england-svgrepo-com.svg";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * Header component that displays a fixed navigation bar at the top of the page.
 * It includes a title, a hoverable menu triggered by a hamburger icon, and a language selector.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component.
 *
 * @description
 * - The header is fixed at the top of the viewport and spans the full width of the screen.
 * - It contains a title "Workday-Vacuumers" styled with uppercase, italic, and light font.
 * - A hoverable navigation link-menu is displayed when the user hovers over the hamburger icon on the Header's right side.
 * - The visibility and position of the menu are animated using CSS transitions.
 * - A language selector is included on the left side, allowing users to switch between Finnish and English.
 * - Language changes trigger animations for visual feedback.
 * - The header includes icons for branding and visual appeal.
 */
const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLanguageHovered, setIsLanguageHovered] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsScrolled(scrollPosition > heroHeight * 0.8); // Show header after scrolling 80% of hero height
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Handles the language change process by updating the current language
   * and triggering a temporary animation state.
   *
   * @param {string} newLanguage - The new language to switch to.
   * @returns {void}
   */
  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language) {
      setIsLanguageChanging(true);
      changeLanguage(newLanguage);
      // Reset animation after a short delay
      setTimeout(() => {
        setIsLanguageChanging(false);
      }, 600);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 translate-y-0 opacity-100"
          : "bg-transparent border-b border-transparent -translate-y-full opacity-0"
      } text-black`}
    >
      <div
        className={`w-full flex justify-center items-center px-4 sm:px-6 md:px-8 transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        } relative`}
      >
        {/* Language Selector - Left */}
        <div
          className="absolute left-3 sm:left-4 md:left-6 lg:left-8 flex items-center"
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
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-3 sm:px-4 md:px-5 lg:px-6 py-4 text-black pl-10 sm:pl-12 md:pl-14 lg:pl-16">
              <div
                onClick={() => handleLanguageChange("fi")}
                className={`flex flex-col items-center cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium ${
                  language === "fi"
                    ? "opacity-100 font-medium text-gray-900"
                    : ""
                }`}
              >
                <img
                  src={flagFi}
                  alt="Finnish flag"
                  className="w-4 h-3 sm:w-5 sm:h-4 md:w-6 md:h-4 mb-1 rounded-sm"
                />
                <span className="text-xs sm:text-xs md:text-sm">FIN</span>
              </div>
              <div
                onClick={() => handleLanguageChange("en")}
                className={`flex flex-col items-center cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium ${
                  language === "en"
                    ? "opacity-100 font-medium text-gray-900"
                    : ""
                }`}
              >
                <img
                  src={flagEngland}
                  alt="English flag"
                  className="w-4 h-3 sm:w-5 sm:h-4 md:w-6 md:h-4 mb-1 rounded-sm"
                />
                <span className="text-xs sm:text-xs md:text-sm">ENG</span>
              </div>
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
            <img
              src={language === "fi" ? flagFi : flagEngland}
              alt={language === "fi" ? "Finnish flag" : "English flag"}
              className="w-4 h-3 sm:w-5 sm:h-4 rounded-sm"
            />
            <span className="uppercase tracking-wide">
              {language === "fi" ? "FIN" : "ENG"}
            </span>
          </div>
        </div>

        {/* Main Logo Area - Center */}
        <div
          className={`flex items-center space-x-1 sm:space-x-2 md:space-x-3 transition-all duration-500 ${
            isLanguageChanging ? "scale-105 brightness-110" : "scale-100"
          }`}
        >
          {/* Car Icon - Left */}
          <img
            src={carIcon}
            alt="Car"
            className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 transition-all duration-500 ${
              isLanguageChanging ? "rotate-12" : "rotate-0"
            }`}
          />

          {/* Title */}
          <div
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest font-cottage uppercase italic transition-all duration-500 ${
              isLanguageChanging ? "text-brand-purple" : "text-black"
            }`}
          >
            Workday-Vacuumers
          </div>

          {/* Vacuum Icon - Right */}
          <img
            src={vacuumIcon}
            alt="Vacuum Cleaner"
            className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 opacity-70 transition-all duration-500 ${
              isLanguageChanging
                ? "-rotate-12 opacity-100"
                : "rotate-0 opacity-70"
            }`}
          />
        </div>

        <div
          className="absolute right-3 sm:right-4 md:right-6 lg:right-8 flex items-center"
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
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 px-3 sm:px-4 md:px-5 lg:px-6 py-4 text-black pr-10 sm:pr-12 md:pr-14 lg:pr-16">
              <span className="block cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-xs sm:text-xs md:text-sm">
                {t("nav.services")}
              </span>
              <span className="block cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-xs sm:text-xs md:text-sm">
                {t("nav.about")}
              </span>
              <span className="block cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-xs sm:text-xs md:text-sm">
                {t("nav.order")}
              </span>
              <span className="block cursor-pointer hover:opacity-100 hover:scale-110 opacity-70 whitespace-nowrap italic transition-all duration-600 font-cottage hover:text-gray-900 hover:font-medium text-xs sm:text-xs md:text-sm">
                {t("nav.contact")}
              </span>
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
