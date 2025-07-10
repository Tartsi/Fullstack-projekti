import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * About component that displays information about the Workday Vacuumers service.
 * Features a two-column layout with text on the left and placeholder image on the right.
 *
 * @component
 * @returns {JSX.Element} The rendered About section.
 *
 * @description
 * - Displays a title "What is Workday Vacuumers?"
 * - Provides a 3-sentence explanation of the concept
 * - Two-column desktop layout (text left, image right)
 * - Responsive design that stacks on mobile
 * - Fade-in and slide-up animation when section comes into view
 * - Accessible anchor point for header navigation
 */
const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  // Responsible for section-visibility + animation triggering
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <section
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-brand-lightgrey text-black"
    >
      <div className="max-w-screen-xl mx-auto">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Text Content - Left Column */}
          <div className="space-y-6">
            <h2
              id="about-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic tracking-wide text-brand-dark"
            >
              {t("about.title")}
            </h2>

            <div className="space-y-4">
              <p className="text-base sm:text-lg font-cottage text-gray-700 leading-relaxed">
                {t("about.description1")}
              </p>

              <p className="text-base sm:text-lg font-cottage text-gray-700 leading-relaxed">
                {t("about.description2")}
              </p>

              <p className="text-base sm:text-lg font-cottage text-gray-700 leading-relaxed">
                {t("about.description3")}
              </p>
            </div>

            {/* Value Proposition */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/50 rounded-lg border-l-4 border-brand-purple">
              <p className="text-lg sm:text-xl font-cottage italic text-brand-dark leading-relaxed">
                "{t("about.valueProposition")}"
              </p>
            </div>
          </div>

          {/* Image/Illustration - Right Column */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Placeholder Image Container */}
              <div className="aspect-square bg-gradient-to-br from-brand-blue to-brand-purple rounded-2xl shadow-lg p-6 sm:p-8 flex items-center justify-center">
                <div className="text-center space-y-3 sm:space-y-4">
                  {/* Car Icon SVG */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>

                  {/* Sparkle Effect */}
                  <div className="space-y-2">
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-brand-neon rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-brand-green rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-brand-neon rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm font-cottage">
                      {t("about.imagePlaceholder")}
                    </p>
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
