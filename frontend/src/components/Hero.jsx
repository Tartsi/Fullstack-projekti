import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import carIcon from "../assets/icons/car-salesman-service-svgrepo-com.svg";
import vacuumIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import carLotIcon from "../assets/icons/car-lot-park-svgrepo-com.svg";
import cacheCleanerIcon from "../assets/icons/cache-cleaner-svgrepo-com.svg";
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

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 200);

    // Handle scroll for parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToContent = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback to hero height if about section is not found
      const heroHeight = window.innerHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-lightgrey via-brand-blue to-brand-purple overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-20 left-10 transition-opacity duration-1000 delay-200 ${
            isVisible ? "opacity-10" : "opacity-0"
          }`}
        >
          <img
            src={carLotIcon}
            alt="Background car lot"
            className="w-32 h-32 lg:w-48 lg:h-48"
          />
        </div>
        <div
          className={`absolute bottom-20 right-10 transition-opacity duration-1000 delay-400 ${
            isVisible ? "opacity-10" : "opacity-0"
          }`}
        >
          <img
            src={cacheCleanerIcon}
            alt="Background cache cleaner"
            className="w-24 h-24 lg:w-36 lg:h-36 -rotate-12"
          />
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Language Selector */}
        <div
          className={`flex justify-center items-center space-x-6 mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className={`flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all duration-300 ${
              language === "fi"
                ? "opacity-100 font-semibold"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => changeLanguage("fi")}
          >
            <img
              src={flagFi}
              alt="Finnish flag"
              className="w-6 h-4 sm:w-8 sm:h-5"
            />
            <span className="text-black font-cottage text-sm sm:text-base font-medium">
              FIN
            </span>
          </div>

          <div className="w-px h-6 bg-black opacity-30"></div>

          <div
            className={`flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all duration-300 ${
              language === "en"
                ? "opacity-100 font-semibold"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => changeLanguage("en")}
          >
            <img
              src={flagEngland}
              alt="English flag"
              className="w-6 h-4 sm:w-8 sm:h-5"
            />
            <span className="text-black font-cottage text-sm sm:text-base font-medium">
              ENG
            </span>
          </div>
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
          <div className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic text-black">
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
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-black mb-8 font-cottage italic max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-900 ${
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
            className="group bg-brand-purple hover:bg-brand-dark text-black font-cottage text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl hover:shadow-brand-purple/50 transform hover:scale-105 transition-all duration-300 uppercase tracking-wider border-2 border-transparent hover:border-brand-neon cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <span>{t("hero.scrollText")}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </button>
        </div>

        {/* Back to Top Button */}
        <div
          onClick={scrollToTop}
          className={`absolute top-8 right-8 cursor-pointer transition-all duration-1000 delay-1300 ${
            isVisible && scrollY > 100
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col items-center text-black opacity-70 hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20">
            <div className="text-xl animate-bounce">↑</div>
            <span className="text-xs font-cottage uppercase tracking-wider">
              Ylös
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
