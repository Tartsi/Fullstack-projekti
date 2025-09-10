import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import ReviewCard from "./ReviewCard";

/**
 * UserReviewSection component that displays customer reviews in a rotating carousel
 * with an overall rating widget below.
 *
 * @component
 * @returns {JSX.Element} The rendered UserReviewSection component.
 *
 * @description
 * - Displays section headline "Wocuuming pelasti päiväni!" (H2) centered
 * - Rotating carousel showing 3 testimonials at a time:
 *   • Front card in focus (center, scale 1, opacity 1)
 *   • Left card = previous review (translateX -40%, scale 0.8, opacity 0.4)
 *   • Right card = next review (translateX 40%, scale 0.8, opacity 0.4)
 * - Auto-advance every 5 seconds with infinite loop
 * - Overall rating widget with proportionally filled star
 * - Responsive design: mobile shows only center card
 * - Smooth 1.5-second transitions following project animation standards
 * - Top-to-bottom entrance animations with intersection observer
 */
const UserReviewSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  // Placeholder review data as specified in requirements
  const reviews = [
    {
      id: 1,
      name: "Ritva",
      age: 43,
      rating: 5,
      comment:
        "Olipa kätevä tapa saada autoni puhtaaksi. Kiitos Wocuumingille!",
      img: "/placeholders/female-1.webp",
    },
    {
      id: 2,
      name: "Matti",
      age: 55,
      rating: 4,
      comment:
        "Ihan parasta, että siivous tapahtuu silloin, kun auto seisoo tyhjän panttina parkkiksella.",
      img: "/placeholders/male-1.webp",
    },
    {
      id: 3,
      name: "Tiina",
      age: 24,
      rating: 5,
      comment:
        "Kaveri kertoi tästä ja oli hyvä vinkki. Kaupungissa on vaikeaa saada auto itse imuroitua.",
      img: "/placeholders/female-2.webp",
    },
    {
      id: 4,
      name: "Pena",
      age: 58,
      rating: 4,
      comment: "Käytän jatkossakin, helppoa ja edullista!",
      img: "/placeholders/male-2.webp",
    },
    {
      id: 5,
      name: "Sari",
      age: 35,
      rating: 5,
      comment:
        "Loistava palvelu! Auto oli täydellisen puhdas kun tulin töistä.",
      img: "/placeholders/female-1.webp",
    },
  ];

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  /**
   * Move to next review in carousel with animation
   */
  const nextReview = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    // First, fade out content
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 500);

    // Then fade in new content
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [reviews.length, isAnimating]);

  /**
   * Move to previous review in carousel with animation
   */
  const prevReview = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    // First, fade out content
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
      );
    }, 500);

    // Then fade in new content
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [reviews.length, isAnimating]);

  /**
   * Start auto-rotation timer
   */
  const startAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isPaused && !isAnimating) {
        nextReview();
      }
    }, 7000); // Slowed down by 2 seconds (5000 + 2000)
  }, [nextReview, isPaused, isAnimating]);

  /**
   * Stop auto-rotation timer
   */
  const stopAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Handle mouse enter (pause rotation)
   */
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  /**
   * Handle mouse leave (resume rotation)
   */
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Get the review at a specific offset from current index
   */
  const getReviewAtOffset = (offset) => {
    const index = (currentIndex + offset + reviews.length) % reviews.length;
    return reviews[index];
  };

  /**
   * Generate star SVG with proportional fill
   */
  const renderStar = () => {
    const fillPercentage = (averageRating / 5) * 90;

    return (
      <svg
        className="w-28 h-28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${fillPercentage}%`} stopColor="#FACC15" />
            <stop offset={`${fillPercentage}%`} stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#starGradient)"
          stroke="#9CA3AF"
          strokeWidth="0.8"
        />
      </svg>
    );
  };

  // Intersection Observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -200px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (isVisible) {
      startAutoRotation();
    }

    return () => stopAutoRotation();
  }, [isVisible, startAutoRotation, stopAutoRotation]);

  // Update auto-rotation when pause state changes
  useEffect(() => {
    if (isVisible) {
      startAutoRotation();
    }
  }, [isPaused, isVisible, isAnimating, startAutoRotation]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      role="region"
      aria-labelledby="reviews-title"
      className="max-w-screen-xl mx-auto py-24 px-6 text-black relative z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Section Headline */}
      <h2
        id="reviews-title"
        className={`uppercase text-3xl md:text-4xl font-light text-center
        mb-4 font-cottage text-brand-dark transition-all duration-[1500ms]
        delay-[350ms] underline decoration-2 underline-offset-4 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {t("reviews.headline")}
      </h2>

      {/* Carousel Container */}
      <div
        className={`relative flex items-center justify-center overflow-visible
           min-h-[500px] transition-all duration-[1500ms] delay-[700ms] ${
             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
           }`}
      >
        {/* Desktop/Tablet: Three cards visible */}
        <div className="hidden md:flex items-center justify-center relative w-full max-w-7xl min-h-[500px]">
          {/* Left Card (Previous) */}
          <div className="absolute left-10 z-10">
            <ReviewCard
              review={getReviewAtOffset(-1)}
              position="left"
              isVisible={true}
              isAnimating={isAnimating}
            />
          </div>

          {/* Center Card (Current) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
            <ReviewCard
              review={getReviewAtOffset(0)}
              position="center"
              isVisible={true}
              isAnimating={isAnimating}
              showNavigation={true}
              onPrevious={prevReview}
              onNext={nextReview}
            />
          </div>

          {/* Right Card (Next) */}
          <div className="absolute right-10 z-10">
            <ReviewCard
              review={getReviewAtOffset(1)}
              position="right"
              isVisible={true}
              isAnimating={isAnimating}
            />
          </div>
        </div>

        {/* Mobile: Single card with arrows */}
        <div className="md:hidden flex items-center justify-center relative w-full">
          <ReviewCard
            review={getReviewAtOffset(0)}
            position="center"
            isVisible={true}
            isAnimating={isAnimating}
            showNavigation={true}
            onPrevious={prevReview}
            onNext={nextReview}
          />
        </div>
      </div>

      {/* Overall Rating Widget */}
      <div
        className={`flex items-center justify-center space-x-4 transition-all duration-[1500ms] delay-[2050ms] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Star Icon */}
        <div className="flex-shrink-0">{renderStar()}</div>

        {/* Rating Text */}
        <div className="text-center">
          <div className="text-4xl font-bold text-brand-dark font-body">
            {averageRating.toFixed(1)} / 5
            <div className="uppercase text-base text-gray-600 mt-2 font-">
              {t("reviews.overall")}!
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility: Screen reader content */}
      <div className="sr-only">
        <p>
          Customer reviews carousel. Use arrow keys to navigate between reviews.
        </p>
        <p>
          Overall rating: {averageRating.toFixed(1)} out of 5 stars based on{" "}
          {reviews.length} reviews.
        </p>
      </div>
    </section>
  );
};

export default UserReviewSection;
