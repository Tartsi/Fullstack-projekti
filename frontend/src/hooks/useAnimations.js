import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for intersection observer animations
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for triggering intersection
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @returns {Object} - { isVisible, sectionRef, getAnimationClass }
 */
export const useIntersectionAnimation = ({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Disconnect observer after first trigger for better performance
      observerRef.current?.disconnect();
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(section);

    // Cleanup function to prevent memory leaks
    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  /**
   * Helper function to create consistent animation classes
   * @param {string} delay - Tailwind delay class (e.g., "200", "400")
   * @param {string} transform - Initial transform state (default: translate-y-4)
   * @param {number} duration - Animation duration in milliseconds (default: 700)
   * @returns {string} - Complete animation class string
   */
  const getAnimationClass = useCallback(
    (delay, transform = "translate-y-4", duration = 700) => {
      // Simplified class generation with consistent patterns
      const durationClass =
        duration === 1000 ? "duration-1000" : "duration-700";
      const delayClass = delay ? `delay-${delay}` : "";

      const baseClasses = `transition-all ${durationClass} ${delayClass}`;
      const visibleClasses =
        "opacity-100 translate-x-0 translate-y-0 scale-100";
      const hiddenClasses = `opacity-0 ${transform}`;

      return `${baseClasses} ${isVisible ? visibleClasses : hiddenClasses}`;
    },
    [isVisible]
  );

  return {
    isVisible,
    sectionRef,
    getAnimationClass,
  };
};

/**
 * Custom hook for scroll position tracking
 * @param {Function} callback - Optional callback function to call on scroll
 * @returns {number} - Current scroll Y position
 */
export const useScrollPosition = (callback) => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const position = window.scrollY;
    setScrollY(position);
    if (callback) callback(position);
  }, [callback]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollY;
};
