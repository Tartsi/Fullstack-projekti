import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { languageOptions } from "../utils/languageUtils";
import { scrollAnimations } from "../utils/scrollUtils";
import { checkBackendHealth } from "../services/users";
import carIcon from "../assets/icons/car-salesman-service-svgrepo-com.svg";
import vacuumIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  /**
   * Optimized scroll handler using useCallback
   */
  const handleScroll = useCallback(() => setScrollY(window.scrollY), []);

  /**
   * Enhanced scroll to content using centralized scroll utility
   */
  const scrollToContent = useCallback(() => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      scrollAnimations.medium("about");
    } else {
      // Fallback for initial load
      const heroHeight = window.innerHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    }
  }, []);

  /**
   * Scroll to the explanation section (process)
   */
  const scrollToProcess = useCallback(() => {
    scrollAnimations.medium("explanation");
  }, []);

  /**
   * Scroll to the services section (pricing calendar) with ultra-slow animation on large screens
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

  /**
   * Login function that tests backend connection
   */
  const handleLogin = useCallback(async () => {
    setIsConnecting(true);
    setConnectionStatus(null);

    try {
      // health check
      const healthResult = await checkBackendHealth();

      if (healthResult.success) {
        setConnectionStatus({
          type: "success",
          message: `✅ Health-check working!`,
          details: {
            health: healthResult.data,
            timestamp: new Date().toLocaleString(),
          },
        });

        console.log("Backend connection test results:", {
          health: healthResult,
        });
      } else {
        setConnectionStatus({
          type: "warning",
          message: "⚠️ Partial connection issues detected",
          details: {
            healthSuccess: healthResult.success,
            healthMessage: healthResult.message,
          },
        });
      }
    } catch (error) {
      setConnectionStatus({
        type: "error",
        message: "❌ Failed to connect to backend",
        details: {
          error: error.message,
          timestamp: new Date().toLocaleString(),
        },
      });
      console.error("Connection test failed:", error);
    } finally {
      setIsConnecting(false);
      // Auto-clear status after 10 seconds
      setTimeout(() => {
        setConnectionStatus(null);
      }, 10000);
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

  return (
    <section
      role="region"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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

        {/* Action Buttons */}
        <div
          className={`transition-all duration-1000 delay-1100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
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

            <button
              onClick={handleLogin}
              disabled={isConnecting}
              className={`group bg-transparent hover:bg-brand-purple text-black font-cottage text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl
              hover:shadow-brand-purple/50 transform hover:scale-105 transition-all duration-300 uppercase tracking-wider border-2 border-black hover:border-brand-purple cursor-pointer
              ${
                isConnecting
                  ? "opacity-50 cursor-not-allowed transform-none hover:scale-100"
                  : ""
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>
                  {isConnecting ? "Testing Connection..." : t("hero.login")}
                </span>
                {isConnecting && (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                )}
              </span>
            </button>
          </div>

          {/* Connection Status Display (TEMPORARY!)*/}
          {connectionStatus && (
            <div
              className={`mb-6 mx-auto max-w-2xl p-4 rounded-lg shadow-lg transition-all duration-500 ${
                connectionStatus.type === "success"
                  ? "bg-green-100 border-2 border-green-500 text-green-800"
                  : connectionStatus.type === "warning"
                  ? "bg-yellow-100 border-2 border-yellow-500 text-yellow-800"
                  : "bg-red-100 border-2 border-red-500 text-red-800"
              }`}
            >
              <div className="text-center">
                <p className="font-cottage text-lg mb-2">
                  {connectionStatus.message}
                </p>
                {connectionStatus.details && (
                  <details className="text-sm text-left cursor-pointer">
                    <summary className="font-semibold hover:underline">
                      View Details
                    </summary>
                    <pre className="mt-2 bg-white/50 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(connectionStatus.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 md:space-x-12">
            <button
              onClick={scrollToProcess}
              className="text-black font-cottage text-sm sm:text-base md:text-lg italic underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              {t("nav.process")}
            </button>
            <button
              onClick={scrollToServices}
              className="text-black font-cottage text-sm sm:text-base md:text-lg italic underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              {t("nav.order")}
            </button>
            <button
              onClick={scrollToContact}
              className="text-black font-cottage text-sm sm:text-base md:text-lg italic underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              {t("nav.contact")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
