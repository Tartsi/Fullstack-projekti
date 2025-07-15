import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import carIcon from "../assets/icons/car-svgrepo-com.svg";

/**
 * About component that displays information about the WOCUUMING service by Workday-Vacuumers.
 * Features a two-column layout with text on the left and placeholder image on the right.
 *
 * @component
 * @returns {JSX.Element} The rendered About section.
 *
 * @description
 * - Displays a title "What is WOCUUMING? - explains the (WOCUUMING) concept"
 * - Provides a 3-sentence explanation of the service concept
 * - Two-column desktop layout (text left, image right)
 * - Responsive design that stacks on mobile
 * - Fade-in and slide-up animation when section comes into view
 * - Accessible anchor point for header navigation
 */
const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  /**
   * Handles intersection observer callback to trigger animations
   * Optimized to use single entry instead of forEach
   */
  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Disconnect observer after first trigger for better performance
      observerRef.current?.disconnect();
    }
  }, []);

  // Optimized intersection observer setup with ref usage
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    observerRef.current.observe(section);

    // Cleanup function to prevent memory leaks
    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection]);

  /**
   * Helper function to create consistent animation classes
   * Reduces repetitive code and improves maintainability
   */
  const getAnimationClass = useCallback(
    (delay, transform = "translate-y-4") => {
      const baseClasses = "transition-all duration-700";
      const visibleClasses =
        "opacity-100 translate-x-0 translate-y-0 scale-100";
      const hiddenClasses = `opacity-0 ${transform}`;

      return `${baseClasses} delay-${delay} ${
        isVisible ? visibleClasses : hiddenClasses
      }`;
    },
    [isVisible]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 text-black relative z-10"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Left Column */}
          <div
            className={`space-y-6 ${getAnimationClass(
              "200",
              "-translate-x-8"
            )}`}
          >
            <h2
              id="about-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic tracking-wide text-brand-dark underline"
            >
              {t("about.title")}
            </h2>

            {/* Description paragraphs with optimized rendering */}
            <div className="space-y-4">
              {["description1", "description2", "description3"].map(
                (key, index) => (
                  <p
                    key={key}
                    className={`text-base sm:text-lg font-body text-gray-700 font-bold leading-relaxed ${getAnimationClass(
                      400 + index * 200
                    )}`}
                  >
                    {t(`about.${key}`)}
                  </p>
                )
              )}
            </div>

            {/* Value Proposition Highlight */}
            <div
              className={`mt-6 sm:mt-8 p-4 sm:p-6 bg-white/80 rounded-lg border-l-4 border-brand-purple shadow-md ${getAnimationClass(
                "1000",
                "translate-y-8 scale-95"
              )}`}
            >
              <p className="text-lg sm:text-xl font-cottage italic text-brand-dark leading-relaxed">
                "{t("about.valueProposition")}"
              </p>
            </div>
          </div>

          {/* Image/Illustration - Right Column */}
          <div
            className={`flex justify-center md:justify-end ${getAnimationClass(
              "500",
              "translate-x-8 scale-95"
            )}`}
          >
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Interactive Car Icon Container */}
              <div className="aspect-square rounded-2xl shadow-xl p-6 sm:p-8 flex items-center bg-transparent justify-center">
                <div className="text-center space-y-3 sm:space-y-4">
                  {/* Main Car Icon */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-white/30 rounded-full flex items-center justify-center ${getAnimationClass(
                      "700",
                      "scale-75 rotate-12"
                    )}`}
                  >
                    <img
                      src={carIcon}
                      alt="Car icon representing professional cleaning service"
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
