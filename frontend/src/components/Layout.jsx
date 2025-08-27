import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Explanation from "./Explanation";
import PricingCalendar from "./PricingCalendar";
import UserReviewSection from "./UserReviewSection";
import Footer from "./Footer";
import backgroundImage from "../assets/background/blob-scene-haikei.svg";

/**
 * Layout component that serves as the main structure for the application.
 * It includes a header at the top, a main content area for child components,
 * and a footer
 *
 * @param {Object} props - The props object.
 * @returns {JSX.Element} The rendered Layout component.
 *
 * @description
 * - Uses a flexible layout structure with proper semantic HTML
 * - Includes background styling with CSS variables for better maintainability
 * - Responsive design that works across all device sizes
 */
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col text-white font-cottage">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-0 -z-10 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />

      {/* Current Layout Structure */}
      <Header />
      <Hero />
      <About />
      <Explanation />
      <UserReviewSection />
      <PricingCalendar />
      <Footer />
    </div>
  );
};

export default Layout;
