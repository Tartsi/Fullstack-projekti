import React from "react";
import Header from "./Header";
// import Footer from "./Footer";

/**
 * Layout component that serves as the main structure for the application.
 * It includes a header at the top, a main content area for child components,
 * and a footer (currently commented out).
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the main content area.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-lightgrey text-white">
      <Header />
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
