import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Explanation from "./Explanation";
import Footer from "./Footer";
import TransitionArrow from "./TransitionArrow";

/**
 * Layout component that serves as the main structure for the application.
 * It includes a header at the top, a main content area for child components,
 * and a footer
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the main content area.
 * @returns {JSX.Element} The rendered Layout component.
 *
 * @description
 * - Uses a flexible layout structure with proper semantic HTML
 * - Includes background styling with CSS variables for better maintainability
 * - Responsive design that works across all device sizes
 */
const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col text-white font-cottage"
      style={{
        backgroundImage: `url('./src/assets/background/blob-scene-haikei.svg')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <Hero />
      <About />

      {/* Transition Section between About and Explanation */}
      <TransitionArrow
        targetSectionId="explanation"
        triggerSectionId="about"
        delayAfterTrigger={1500}
      />

      <Explanation />
      {/* Main content area for future components */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
