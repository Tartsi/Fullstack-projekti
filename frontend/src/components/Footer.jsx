import React from "react";

/**
 * Footer component that renders a website footer section with contact information,
 * social media links, and copyright details.
 *
 * @component
 * @returns {JSX.Element} The rendered footer section.
 *
 * @description
 * - Displays a centered "Contact" header.
 * - Provides contact information including email, phone number, and address (PLACEHOLDERS CURRENTLY!).
 * - Includes social media links with hover effects and corresponding labels (PLACEHOLDERS CURRENTLY!).
 * - Shows copyright information with the current year.
 *
 * @example
 * <Footer />
 */
const Footer = () => {
  return (
    <footer className="bg-transparent text-black py-8 font-light">
      <div className="max-w-screen-xl mx-auto px-8">
        {/* Large Centered Contact Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl tracking-widest uppercase italic underline decoration-2 underline-offset-4">
            Contact
          </h2>
        </div>
        {/* Contact Information */}
        <div className="text-center mb-6">
          <div className="space-y-3 text-sm opacity-70 italic">
            <div>info@workday-vacuumers.com</div>
            <div>+358 00 000 0000</div>
            <div>123 Clean Street, Spotless City, 00100</div>
          </div>
        </div>
        {/* Social Media */}
        <div className="text-center mb-6">
          <h3 className="text-sm tracking-wide uppercase italic mb-2 opacity-90">
            Follow Us On Social Media!
          </h3>
          <div className="flex justify-center space-x-6 mb-3">
            <a
              href="#"
              className="text-2xl hover:scale-125 transform transition-transform duration-700 opacity-70 hover:opacity-100"
            >
              𝕏
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transform transition-transform duration-700 opacity-70 hover:opacity-100"
            >
              💼
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transform transition-transform duration-700 opacity-70 hover:opacity-100"
            >
              👾
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transform transition-transform duration-700 opacity-70 hover:opacity-100"
            >
              📷
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transform transition-transform duration-700 opacity-70 hover:opacity-100"
            >
              🎵
            </a>
          </div>
          <div className="text-xs opacity-60 space-x-4">
            <span>Twitter</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
            <span>Instagram</span>
            <span>TikTok</span>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center text-xs tracking-wide opacity-60 border-t border-gray-200">
          © {new Date().getFullYear()} Workday-Vacuumers. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
