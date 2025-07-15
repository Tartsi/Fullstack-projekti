import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import carIcon from "../assets/icons/car-salesman-service-svgrepo-com.svg";
import vacuumIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import flagFi from "../assets/icons/flag-fi-svgrepo-com.svg";
import flagEngland from "../assets/icons/flag-england-svgrepo-com.svg";

/**
 * Hero component that displays a full-screen landing section with main message,
 * call-to-action, and animated elements.
 *
 * @component
 * @returns {JSX.Element} The rendered Hero component.
 *
 * @description
 * - Full viewport height hero section
 * - Main headline and subheading with company message
 * - Animated learn more button
 * - Language selector with flag icons
 * - Background animations with car and vacuum icons
 */
const Hero = () => {
  const { t, language, changeLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  /**
   * Optimized scroll handler using useCallback
   */
  const handleScroll = useCallback(() => setScrollY(window.scrollY), []);

  /**
   * Ultra slow scroll to content function for maximum smoothness
   * Uses custom smooth scrolling with extended duration
   */
  const scrollToContent = useCallback(() => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      // Get the target position
      const targetPosition = aboutSection.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 3000; // 3 seconds for ultra slow scroll
      let start = null;

      // Custom easing function for ultra smooth animation
      const easeInOutCubic = (t) => {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    } else {
      // Fallback with ultra slow scroll
      const heroHeight = window.innerHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 200);

    // Handle scroll for parallax effect
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Language configuration to reduce repetition
  const languageOptions = [
    { code: "fi", flag: flagFi, label: "FIN", alt: "Finnish flag" },
    { code: "en", flag: flagEngland, label: "ENG", alt: "English flag" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Main Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Language Selector */}
        <div
          className={`flex justify-center items-center space-x-6 mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {languageOptions.map((option, index) => (
            <React.Fragment key={option.code}>
              {index > 0 && (
                <div className="w-px h-6 bg-black opacity-30"></div>
              )}
              <div
                className={`flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all duration-300 ${
                  language === option.code
                    ? "opacity-100 font-semibold"
                    : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => changeLanguage(option.code)}
              >
                <img
                  src={option.flag}
                  alt={option.alt}
                  className="w-6 h-4 sm:w-8 sm:h-5"
                />
                <span className="text-black font-cottage text-sm sm:text-base font-medium">
                  {option.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Logo/Brand Icons */}
        <div
          className={`flex justify-center items-center space-x-4 mb-8 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <img
            src={carIcon}
            alt="Car"
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 filter drop-shadow-lg"
          />
          <div className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic underline text-black">
            Workday-Vacuumers
          </div>
          <img
            src={vacuumIcon}
            alt="Vacuum"
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 filter drop-shadow-lg opacity-80"
          />
        </div>

        {/* Main Headline */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cottage font-bold text-black mb-6 leading-tight transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t("hero.headline")}
        </h1>

        {/* Subheading */}
        <p
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-black mb-8 font-body italic max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t("hero.subheading")}
        </p>

        {/* Learn More Button */}
        <div
          className={`transition-all duration-1000 delay-1100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={scrollToContent}
            className="group bg-brand-purple hover:bg-brand-dark text-black font-cottage text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl
            hover:shadow-brand-purple/50 transform hover:scale-105 transition-all duration-300 uppercase tracking-wider border-2 border-transparent hover:border-brand-neon cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <span>{t("hero.scrollText")}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
