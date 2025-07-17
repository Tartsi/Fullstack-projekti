/**
 * Scroll utilities for smooth and consistent animations
 */
export const easingFunctions = {
  // Ease-in-out-quad (gentle acceleration and deceleration)
  easeInOutQuad: (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  },

  // Ease-in-out-cubic (stronger acceleration and deceleration)
  easeInOutCubic: (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
};

/**
 * Custom smooth scroll to element with configurable duration and easing
 * @param {string} elementId - ID of the target element
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} easingFunction - Easing function to use
 * @param {number} offset - Optional offset from the top of the element
 */
export const smoothScrollToElement = (
  elementId,
  duration = 2000,
  easingFunction = easingFunctions.easeInOutQuad,
  offset = 0
) => {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) return;

  const startPosition = window.pageYOffset;
  const targetPosition = targetElement.offsetTop - offset;
  const distance = targetPosition - startPosition;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;

    if (easingFunction === easingFunctions.easeInOutCubic) {
      // For cubic easing, use progress-based calculation
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easingFunction(progress);
      window.scrollTo(0, startPosition + distance * ease);
    } else {
      // For quad easing, use time-based calculation
      const run = easingFunction(
        timeElapsed,
        startPosition,
        distance,
        duration
      );
      window.scrollTo(0, run);
    }

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
};

/**
 * Quick scroll functions with predefined durations
 */
export const scrollAnimations = {
  // Ultra slow (3 seconds) - for hero/header navigation
  ultraSlow: (elementId, offset = 0) =>
    smoothScrollToElement(
      elementId,
      3000,
      easingFunctions.easeInOutCubic,
      offset
    ),

  // Medium (2 seconds) - for section transitions
  medium: (elementId, offset = 0) =>
    smoothScrollToElement(
      elementId,
      2000,
      easingFunctions.easeInOutQuad,
      offset
    ),

  // Fast (1 second) - for quick navigation
  fast: (elementId, offset = 0) =>
    smoothScrollToElement(
      elementId,
      1000,
      easingFunctions.easeInOutQuad,
      offset
    ),
};
