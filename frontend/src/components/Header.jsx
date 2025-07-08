import React, { useState } from "react";

/**
 * Header component that displays a fixed navigation bar at the top of the page.
 * It includes a title and a hoverable menu triggered by a hamburger icon.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component.
 *
 * @description
 * - The header is fixed at the top of the viewport and spans the full width of the screen.
 * - It contains a title "Workday-Vacuumers" styled with uppercase, italic, and light font.
 * - A hoverable menu is displayed when the user hovers over the hamburger icon.
 * - The menu contains three links ("Link 1", "Link 2", "Link 3") with hover effects.
 * - The visibility and position of the menu are animated using CSS transitions.
 *
 * @example
 * <Header />
 */
const Header = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-black border-b">
      <div className="w-full flex justify-center items-center px-4 sm:px-6 md:px-8 py-5 relative">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest font-cottage uppercase italic">
          Workday-Vacuumers
        </div>

        <div
          className="absolute right-4 sm:right-6 md:right-8 flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hover-menu */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-0 text-xs sm:text-sm font-light tracking-wide uppercase transition-all duration-700
                                            ${
                                              isHovered
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-4 pointer-events-none"
                                            }`}
          >
            <div className="flex space-x-3 sm:space-x-4 md:space-x-6 px-4 sm:px-6 py-4 text-black pr-12 sm:pr-14 md:pr-16">
              <span className="block cursor-pointer hover:opacity-100 opacity-70 whitespace-nowrap italic transition-opacity duration-200 font-cottage">
                Link 1
              </span>
              <span className="block cursor-pointer hover:opacity-100 opacity-70 whitespace-nowrap italic transition-opacity duration-200 font-cottage">
                Link 2
              </span>
              <span className="block cursor-pointer hover:opacity-100 opacity-70 whitespace-nowrap italic transition-opacity duration-200 font-cottage">
                Order
              </span>
              <span className="block cursor-pointer hover:opacity-100 opacity-70 whitespace-nowrap italic transition-opacity duration-200 font-cottage">
                Contact
              </span>
            </div>
          </div>

          {/* Hamburger-symbol */}
          <div className="text-3xl sm:text-4xl font-thin cursor-pointer select-none leading-none -mt-2 relative z-10">
            ≡
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
