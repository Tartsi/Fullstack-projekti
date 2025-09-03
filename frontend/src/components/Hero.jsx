import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { languageOptions } from "../utils/languageUtils";
import { scrollAnimations } from "../utils/scrollUtils";
import carIcon from "../assets/icons/car-salesman-service-svgrepo-com.svg";
import vacuumIcon from "../assets/icons/vacuum-cleaner-floor-svgrepo-com.svg";
import loginIcon from "../assets/icons/login-bracket-svgrepo-com.svg";
import logoutIcon from "../assets/icons/logout-bracket-svgrepo-com.svg";
import lockIcon from "../assets/icons/lock-slash-svgrepo-com.svg";
import unlockIcon from "../assets/icons/unlock-svgrepo-com.svg";
import processIcon from "../assets/icons/process-arrows-svgrepo-com.svg";
import orderIcon from "../assets/icons/order-1-svgrepo-com.svg";
import contactIcon from "../assets/icons/contact-us-svgrepo-com.svg";
import AuthModal from "./AuthModal";
import UserModal from "./UserModal";

/**frontend/src/
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
  const { isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [logoutAnim, setLogoutAnim] = useState(false);

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
   * Login/Logout function with animation
   */
  const handleLogin = useCallback(async () => {
    if (isAuthenticated) {
      // Trigger logout animation
      setLogoutAnim(true);

      try {
        await logout();
      } finally {
        // Reset animation after logout completes
        setTimeout(() => {
          setLogoutAnim(false);
        }, 800);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated, logout]);

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
          <div className="text-2xl uppercase sm:text-3xl lg:text-4xl font-cottage italic underline text-black">
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
          className={`uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cottage font-bold text-black mb-6 leading-tight transition-all duration-1000 delay-700 ${
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
          {/* Triangle Formation: Read More at top, User Profile and Login/Logout below */}
          <div className="flex flex-col items-center space-y-6 mb-8">
            {/* Read More Button - Top of triangle */}
            <button
              onClick={scrollToContent}
              className="group bg-brand-purple hover:bg-brand-dark text-black font-cottage text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl
              hover:shadow-brand-purple/50 transform hover:scale-105 transition-all duration-300 uppercase
              tracking-wider border-2 border-black hover:border-brand-neon cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{t("hero.scrollText")}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </button>

            {/* Bottom row of triangle - Login/Logout and User Profile */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Login/Logout Button - Bottom left of triangle */}
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.6 }}
                animate={
                  logoutAnim
                    ? {
                        scale: [1, 1.05, 1],
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      }
                    : {}
                }
                className="relative group bg-transparent hover:bg-brand-purple text-black font-cottage
                text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl hover:shadow-brand-purple/50
                transform transition-all duration-300 uppercase tracking-wider border-2 border-black hover:border-brand-purple cursor-pointer overflow-hidden"
              >
                {/* Soft glow ring on logout */}
                <motion.span
                  className="pointer-events-none absolute -inset-px rounded-full"
                  initial={false}
                  animate={{
                    boxShadow: logoutAnim
                      ? "0 0 0 10px rgba(157,255,249,0.25)"
                      : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ borderRadius: 9999 }}
                />

                {/* Sheen sweep on logout */}
                <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
                  <motion.span
                    className="absolute inset-y-0 -left-1/3 w-1/2 bg-white/25 skew-x-12 blur-sm"
                    initial={{ x: "-120%" }}
                    animate={{ x: logoutAnim ? "220%" : "-120%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </span>

                {/* Label + arrow with crossfade/slide between login/logout */}
                <span className="relative z-10 flex items-center space-x-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={isAuthenticated ? "logout" : "login"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {isAuthenticated ? t("hero.logout") : t("hero.login")}
                    </motion.span>
                  </AnimatePresence>

                  {/* Login icon - only show when not authenticated */}
                  {!isAuthenticated ? (
                    <motion.img
                      src={loginIcon}
                      alt="Login"
                      className="w-5 h-5 ml-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ) : (
                    <motion.img
                      src={logoutIcon}
                      alt="Logout"
                      className="w-5 h-5 ml-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                </span>
              </motion.button>

              {/* User Profile Button - Bottom right of triangle */}
              <button
                onClick={
                  isAuthenticated ? () => setIsUserModalOpen(true) : undefined
                }
                disabled={!isAuthenticated}
                className={`group ${
                  isAuthenticated
                    ? "bg-brand-blue hover:bg-brand-dark cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                } text-black font-cottage text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 rounded-full shadow-2xl
                  transform transition-all duration-300 uppercase tracking-wider border-2 border-black ${
                    isAuthenticated
                      ? "hover:border-brand-neon hover:scale-105 hover:shadow-brand-blue/50"
                      : ""
                  }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{t("hero.userProfile")}</span>
                  <img
                    src={isAuthenticated ? unlockIcon : lockIcon}
                    alt={isAuthenticated ? "Unlocked" : "Locked"}
                    className="w-5 h-5"
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 md:space-x-12">
            <button
              onClick={scrollToProcess}
              className="text-black uppercase font-cottage text-sm sm:text-base md:text-lg italic
              underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{t("nav.process")}</span>
                <img
                  src={processIcon}
                  alt="Process"
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
              </span>
            </button>
            <button
              onClick={scrollToServices}
              className="text-black uppercase font-cottage text-sm sm:text-base md:text-lg italic
              underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{t("nav.order")}</span>
                <img
                  src={orderIcon}
                  alt="Order"
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
              </span>
            </button>
            <button
              onClick={scrollToContact}
              className="text-black uppercase font-cottage text-sm sm:text-base md:text-lg italic
              underline decoration-2 underline-offset-4 hover:scale-110 hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{t("nav.contact")}</span>
                <img
                  src={contactIcon}
                  alt="Contact"
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* AuthModal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* UserModal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
