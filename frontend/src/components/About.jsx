import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useIntersectionAnimation } from "../hooks/useAnimations";

/**
 * About component that displays information about the WOCUUMING service by Workday-Vacuumers.
 * Features a centered single-column layout with company information.
 *
 * @component
 * @returns {JSX.Element} The rendered About section.
 *
 * @description
 * - Displays a title "What is WOCUUMING? - explains the (WOCUUMING) concept"
 * - Provides a 3-sentence explanation of the service concept
 * - Centered single-column layout for better readability
 * - Responsive design that works on all devices
 * - Fade-in and slide-up animation when section comes into view
 * - Accessible anchor point for header navigation
 */
const About = () => {
  const { t } = useLanguage();
  const { sectionRef, getAnimationClass } = useIntersectionAnimation();

  return (
    <section
      ref={sectionRef}
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 md:px-8 text-black relative z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Text Content - Centered */}
        <div
          className={`space-y-6 ${getAnimationClass("200", "translate-y-8")}`}
        >
          <h2
            id="about-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic tracking-wide text-brand-dark underline"
          >
            {t("about.title")}
          </h2>

          {/* Description paragraphs */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {["description1", "description2", "description3"].map(
              (key, index) => (
                <p
                  key={key}
                  className={`text-base sm:text-lg font-body text-center text-gray-700 font-bold leading-relaxed ${getAnimationClass(
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
            className={`mt-8 sm:mt-10 p-4 sm:p-6 bg-white/80 rounded-lg border-l-4 border-brand-purple shadow-md max-w-2xl mx-auto ${getAnimationClass(
              "1000",
              "translate-y-8 scale-95"
            )}`}
          >
            <p className="text-lg sm:text-xl font-cottage italic text-brand-dark leading-relaxed">
              "{t("about.valueProposition")}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
