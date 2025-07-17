import React, { useState, useEffect, useRef, useCallback } from "react";
import { scrollAnimations } from "../utils/scrollUtils";

/**
 * TransitionArrow component that displays an animated arrow to guide users
 * from one section to another with smooth scrolling functionality.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.targetSectionId - The ID of the section to scroll to when clicked.
 * @param {string} props.triggerSectionId - The ID of the section that triggers the arrow appearance.
 * @param {number} [props.delayAfterTrigger=1500] - Delay in milliseconds before showing the arrow after trigger section is visible.
 * @param {number} [props.threshold=0.3] - Intersection observer threshold for triggering visibility.
 * @param {string} [props.rootMargin="0px 0px -100px 0px"] - Root margin for intersection observer.
 * @returns {JSX.Element} The rendered TransitionArrow component.
 *
 * @description
 * - Displays a large animated downward arrow with decorative dots
 * - Appears after a specified trigger section becomes visible
 * - Smooth scroll animation to target section on click
 * - Responsive design with hover effects
 * - Fade-in, slide-up animation with bounce effect
 */
const TransitionArrow = ({
  targetSectionId,
  triggerSectionId,
  delayAfterTrigger = 1500,
  threshold = 0.3,
  rootMargin = "0px 0px -100px 0px",
}) => {
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const observerRef = useRef(null);

  /**
   * Smooth scroll to target section with 2-second animation
   */
  const scrollToTarget = useCallback(() => {
    scrollAnimations.medium(targetSectionId);
  }, [targetSectionId]);

  /**
   * Intersection observer to detect when trigger section is visible
   * and show arrow animation with delay
   */
  useEffect(() => {
    const triggerSection = document.getElementById(triggerSectionId);
    if (!triggerSection) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Delay arrow appearance to let trigger section animation complete
          setTimeout(() => {
            setIsArrowVisible(true);
          }, delayAfterTrigger);

          // Disconnect observer after triggering
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(triggerSection);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [triggerSectionId, delayAfterTrigger, threshold, rootMargin]);

  return (
    <div className="py-8 sm:py-12 lg:py-16 flex justify-center items-center relative">
      <button
        onClick={scrollToTarget}
        className={`flex flex-col items-center space-y-4 group cursor-pointer transition-all duration-1000 hover:scale-110 p-4 ${
          isArrowVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
        aria-label={`Scroll to ${targetSectionId} section`}
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
  );
};

export default TransitionArrow;
