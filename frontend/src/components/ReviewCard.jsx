import React from "react";

/**
 * ReviewCard component that displays a single customer review with avatar, comment, and reviewer info.
 * Used within the UserReviewSection carousel.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.review - The review object containing review data.
 * @param {number} props.review.id - Unique identifier for the review.
 * @param {string} props.review.name - Name of the reviewer.
 * @param {number} props.review.age - Age of the reviewer.
 * @param {number} props.review.rating - Rating given by the reviewer (1-5).
 * @param {string} props.review.comment - Review comment text.
 * @param {string} props.review.img - Image path for reviewer avatar.
 * @param {string} [props.position="center"] - Position of the card in carousel (center, left, right).
 * @param {boolean} [props.isVisible=true] - Whether the card should be visible in viewport.
 * @param {boolean} [props.isAnimating=false] - Whether the card is currently animating.
 * @param {Function} [props.onPrevious] - Callback for previous button click.
 * @param {Function} [props.onNext] - Callback for next button click.
 * @param {boolean} [props.showNavigation=false] - Whether to show navigation arrows.
 * @returns {JSX.Element} The rendered ReviewCard component.
 *
 * @description
 * - Displays circular avatar with fallback to a generated avatar
 * - Shows comment text (max 120 chars)
 * - Displays reviewer name and age
 * - Responsive design with proper scaling and positioning
 * - Smooth transitions for carousel animations with content fade-in
 * - Navigation arrows positioned at the edges inside the card
 */
const ReviewCard = ({
  review,
  position = "center",
  isVisible = true,
  isAnimating = false,
  onPrevious,
  onNext,
  showNavigation = false,
}) => {
  const { name, age, comment, img, rating } = review;

  // Generate a simple avatar based on name if image fails to load (currently always as no backend-solution)
  const generateAvatar = (name) => {
    const initial = name.charAt(0).toUpperCase();
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return (
      <div
        className={`w-16 h-16 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white text-xl font-bold`}
      >
        {initial}
      </div>
    );
  };

  // Position-based styles for carousel
  const getPositionStyles = () => {
    switch (position) {
      case "left":
        return "transform -translate-x-[80%] scale-80 opacity-40";
      case "right":
        return "transform translate-x-[80%] scale-80 opacity-40";
      case "center":
      default:
        return "transform translate-x-0 scale-100 opacity-100";
    }
  };

  // Content visibility for professional animation
  const getContentStyles = () => {
    if (isAnimating) {
      return "opacity-0 scale-95";
    }
    return "opacity-100 scale-100";
  };

  // Visibility styles for responsive design
  const getVisibilityStyles = () => {
    if (!isVisible) {
      return "opacity-0 scale-80";
    }
    return "";
  };

  return (
    <div
      className={`
        bg-white rounded-full shadow-lg p-8 text-center 
        transition-all duration-1000 ease-in-out
        w-80 h-80 md:w-96 md:h-96 flex-shrink-0 flex flex-col justify-center items-center
        font-['Arial',sans-serif] relative
        ${getPositionStyles()}
        ${getVisibilityStyles()}
      `}
    >
      {/* Navigation Arrows */}
      {showNavigation && position === "center" && (
        <>
          {/* Left Navigation Arrow */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-0.25 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-brand-dark transition-all duration-300 hover:scale-110 disabled:opacity-50"
              aria-label="Previous review"
              disabled={isAnimating}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Right Navigation Arrow */}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-0.25 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-brand-dark transition-all duration-300 hover:scale-110 disabled:opacity-50"
              aria-label="Next review"
              disabled={isAnimating}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Card Content with fade animation */}
      <div
        className={`transition-all duration-500 ease-out delay-200 ${getContentStyles()}`}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {img &&
          img !== "/placeholders/female-1.webp" &&
          img !== "/placeholders/male-1.webp" &&
          img !== "/placeholders/female-2.webp" &&
          img !== "/placeholders/male-2.webp" ? (
            <img
              src={img}
              alt={`${name}'s avatar`}
              className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          {/* Fallback avatar - always render but hidden if image loads */}
          <div
            className={`${
              img &&
              img !== "/placeholders/female-1.webp" &&
              img !== "/placeholders/male-1.webp" &&
              img !== "/placeholders/female-2.webp" &&
              img !== "/placeholders/male-2.webp"
                ? "hidden"
                : "flex"
            }`}
          >
            {generateAvatar(name)}
          </div>
        </div>

        {/* Colorful Google Icon */}
        <div className="flex justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-80"
          >
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#FFC107"
            />
            <path
              d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
              fill="#FF3D00"
            />
            <path
              d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.399 18 7.1905 16.3415 6.3585 14.027L3.0975 16.5395C4.7525 19.778 8.1135 22 12 22Z"
              fill="#4CAF50"
            />
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.404C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#1976D2"
            />
          </svg>
        </div>

        {/* Comment */}
        <div className="flex-1 flex items-center justify-center mb-4 px-2">
          <p
            className={`italic leading-tight text-gray-800 text-center ${
              comment.length > 80
                ? "text-sm"
                : comment.length > 60
                ? "text-base"
                : "text-lg"
            }`}
          >
            "{comment}"
          </p>
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center space-x-1 mb-3">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 h-4 ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Reviewer Info */}
        <div className="space-y-1">
          <p className="text-base font-medium text-gray-900">{name}</p>
          <p className="text-xs opacity-70 text-gray-600">{age} vuotta</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
