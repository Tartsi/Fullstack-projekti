import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useIntersectionAnimation } from "../hooks/useAnimations";

/**
 * Explanation component that displays a step-by-step process of how the WOCUUMING service works.
 * Features a centered layout with process steps.
 *
 * @component
 * @returns {JSX.Element} The rendered Explanation section.
 */
const Explanation = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef(null);

  // Use custom hook for intersection animations
  const { isVisible, sectionRef, getAnimationClass } = useIntersectionAnimation(
    {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  // Process steps configuration - simplified with array generation
  const processSteps = Array.from({ length: 6 }, (_, index) => {
    const stepNumber = index + 1;
    const icons = ["�", "📍", "🔓", "⏱️", "✅", "😊"];

    return {
      id: stepNumber,
      title: t(`explanation.steps.step${stepNumber}.title`),
      description: t(`explanation.steps.step${stepNumber}.description`),
      icon: icons[index],
    };
  });

  /**
   * Starts automatic progression through steps
   */
  const startAutoProgression = useCallback(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % processSteps.length);
    }, 7500); // Change every 7.5 seconds
  }, []); // No dependencies to prevent recreation

  // Start auto progression only after section becomes visible and animations complete
  useEffect(() => {
    if (!isVisible) return;

    // Wait for all animations to complete before starting countdown
    // Longest animation delay is 400ms + duration (1000ms) = 1400ms total
    const animationCompletionDelay = 1500; // 1.5 seconds to be safe

    const timeoutId = setTimeout(() => {
      startAutoProgression();
    }, animationCompletionDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, startAutoProgression]);

  return (
    <section
      ref={sectionRef}
      id="explanation"
      role="region"
      aria-labelledby="explanation-title"
      className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-8 text-black relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div
          className={`text-center mb-8 sm:mb-12 ${getAnimationClass(
            "100",
            "translate-y-8",
            1000
          )}`}
        >
          <h2
            id="explanation-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-cottage italic tracking-wide text-brand-dark underline decoration-2 underline-offset-4 mb-4"
          >
            {t("explanation.title")}
          </h2>
        </div>

        {/* Main Content - Centered Layout */}
        <div className="relative">
          {/* Centered Steps Section */}
          <div
            className={`max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto ${getAnimationClass(
              "200",
              "translate-y-8",
              1000
            )}`}
          >
            <div className="space-y-2 sm:space-y-4 lg:space-y-6 xl:space-y-8">
              {processSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Step Container with Border */}
                  <div
                    className={`
                      flex items-start space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-6 p-2 sm:p-3 lg:p-4 xl:p-6 rounded-lg sm:rounded-xl
                      border-2 border-gray-200 transition-all duration-1000 bg-white/80 backdrop-blur-sm shadow-md
                      ${activeStep === index ? "scale-110" : "scale-100"}
                    `}
                    aria-label={`Vaihe ${step.id}: ${step.title}`}
                  >
                    {/* Step Number - Left Side */}
                    <div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center text-lg font-bold
                      bg-brand-purple text-white shadow-lg"
                    >
                      <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-cottage">
                        {step.id}
                      </span>
                    </div>

                    {/* Step Content - Center */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-cottage text-base sm:text-lg lg:text-xl xl:text-2xl font-medium mb-1 sm:mb-2 text-gray-700">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-body leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Icon - Right Side */}
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl">
                        {step.icon}
                      </span>
                    </div>
                  </div>

                  {/* Connecting Arrow - Only show if not the last step */}
                  {index < processSteps.length - 1 && (
                    <div className="flex justify-center my-1 sm:my-2 lg:my-3 xl:my-4">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-brand-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          role="img"
                          aria-label="Step connector arrow"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-6 sm:mt-8 lg:mt-12 ${getAnimationClass(
            "400",
            "translate-y-8",
            1000
          )}`}
        >
          <button
            className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-brand-green text-white font-cottage font-medium
           text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl shadow-lg hover:bg-brand-dark hover:shadow-xl transform hover:scale-105 transition-all duration-600 cursor-pointer"
          >
            <span>{t("explanation.cta")}</span>
            <svg
              className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Arrow right"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Explanation;
