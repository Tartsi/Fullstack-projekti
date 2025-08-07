import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { scrollAnimations } from "../utils/scrollUtils";

/**
 * About component that displays information about the WOCUUMING service by Workday-Vacuumers.
 * Features a centered single-column layout with company information and sequential animations.
 *
 * @component
 * @returns {JSX.Element} The rendered About section.
 *
 * @description
 * - Displays a title "What is WOCUUMING? - explains the (WOCUUMING) concept"
 * - Provides a 3-sentence explanation of the service concept
 * - Centered single-column layout for better readability
 * - Responsive design that works on all devices
 * - Sequential fade-in and slide-up animations triggered by intersection observer
 * - Accessible anchor point for header navigation
 */
const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstDescVisible, setIsFirstDescVisible] = useState(false);
  const [isFirstLineVisible, setIsFirstLineVisible] = useState(false);
  const [isSecondDescVisible, setIsSecondDescVisible] = useState(false);
  const [isSecondLineVisible, setIsSecondLineVisible] = useState(false);
  const [isValuePropVisible, setIsValuePropVisible] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const sectionRef = useRef(null);

  /**
   * Smooth scroll to explanation section with 2-second animation
   */
  const scrollToExplanation = useCallback(() => {
    try {
      scrollAnimations.medium("explanation");
    } catch (error) {
      console.error("Failed to execute scroll animation:", error);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Staggered animation sequence
          setTimeout(() => setIsFirstDescVisible(true), 500); // First description container
          setTimeout(() => setIsFirstLineVisible(true), 1500); // First connecting line
          setTimeout(() => setIsSecondDescVisible(true), 2000); // Second description container
          setTimeout(() => setIsSecondLineVisible(true), 3000); // Second connecting line
          setTimeout(() => setIsValuePropVisible(true), 3500); // Value proposition
          setTimeout(() => setIsArrowVisible(true), 5000); // Arrow

          observer.disconnect(); // Stop observing once triggered
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -300px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 md:px-8 text-black relative z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2
          id="about-title"
          className={`text-2xl sm:text-3xl lg:text-4xl font-cottage italic tracking-wide text-brand-dark underline mb-8 transition-all duration-1000 delay-[350ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t("about.title")}
        </h2>

        {/* First Description Container */}
        <div
          className={`p-6 sm:p-7 lg:p-1 rounded-lg max-w-2xl mx-auto mb-4 h-32 sm:h-28 lg:h-24 flex items-center transition-all duration-1000 ${
            isFirstDescVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <p
            className={`text-base sm:text-lg font-body text-gray-700 font-bold leading-relaxed transition-all duration-800 delay-500 whitespace-pre-line ${
              isFirstDescVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {t("about.descriptionFirst")}
          </p>
        </div>

        {/* First Connecting Line */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-0.5 h-8 bg- transition-all bg-brand-dark duration-800 ${
              isFirstLineVisible
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "top" }}
          ></div>
        </div>

        {/* Second Description Container */}
        <div
          className={`p-6 sm:p-7 lg:p-10 rounded-lg max-w-2xl mx-auto mb-4 h-32 sm:h-28 lg:h-24 flex items-center transition-all duration-1000 ${
            isSecondDescVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <p
            className={`text-base sm:text-lg font-body text-gray-700 font-bold leading-relaxed transition-all duration-800 delay-500 whitespace-pre-line ${
              isSecondDescVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {t("about.descriptionSecond")}
          </p>
        </div>

        {/* Second Connecting Line */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-0.5 h-8 bg-brand-dark transition-all duration-800 ${
              isSecondLineVisible
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "top" }}
          ></div>
        </div>

        {/* Value Proposition Highlight */}
        <div
          className={`p-4 sm:p-6 bg-white rounded-lg border-l-4 border-brand-purple shadow-lg max-w-2xl mx-auto mb-8 transition-all duration-1000 ${
            isValuePropVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <p
            className={`text-lg sm:text-xl font-cottage italic text-brand-dark leading-relaxed transition-all duration-800 delay-500 ${
              isValuePropVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            "{t("about.valueProposition")}"
          </p>
        </div>

        {/* Transition Arrow to Explanation */}
        <div className="py-8 sm:py-12 lg:py-16 flex justify-center items-center relative">
          <button
            onClick={scrollToExplanation}
            className={`flex flex-col items-center space-y-4 group cursor-pointer transition-all duration-1000 hover:scale-110 p-4 ${
              isArrowVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
            aria-label="Scroll to explanation section"
          >
            {/* Large downward arrow */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
              <svg
                className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-brand-dark opacity-80 group-hover:opacity-100 transition-all duration-800 ${
                  isArrowVisible ? "animate-bounce" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2L12 20M12 20L18 14M12 20L6 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Decorative dots */}
            <div className="flex space-x-2">
              <div
                className={`w-2 h-2 bg-brand-dark rounded-full transition-all duration-300 delay-200 ${
                  isArrowVisible ? "opacity-60 scale-100" : "opacity-0 scale-50"
                } group-hover:opacity-80`}
              ></div>
              <div
                className={`w-2 h-2 bg-brand-dark rounded-full transition-all duration-300 delay-400 ${
                  isArrowVisible ? "opacity-40 scale-100" : "opacity-0 scale-50"
                } group-hover:opacity-60`}
              ></div>
              <div
                className={`w-2 h-2 bg-brand-dark rounded-full transition-all duration-300 delay-600 ${
                  isArrowVisible ? "opacity-20 scale-100" : "opacity-0 scale-50"
                } group-hover:opacity-40`}
              ></div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
