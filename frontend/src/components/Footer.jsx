import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

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
 */
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className=" text-black py-8 font-light">
      <div className="max-w-screen-xl mx-auto px-8">
        {/* Large Centered Contact Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl tracking-widest uppercase italic underline decoration-2 underline-offset-4 font-cottage">
            {t("footer.contact")}
          </h2>
        </div>
        {/* Contact Information */}
        <div className="text-center mb-6">
          <div className="space-y-3 text-sm opacity-70 italic font-cottage">
            <div>{t("footer.email")}</div>
            <div>{t("footer.phone")}</div>
            <div>{t("footer.address")}</div>
          </div>
        </div>
        {/* Social Media */}
        <div className="text-center mb-2">
          <h3 className="text-sm tracking-wide uppercase italic mb-4 opacity-90 font-cottage">
            {t("footer.followUs")}
          </h3>
          <div className="flex justify-center space-x-8 mb-3">
            <a
              href="#"
              className="flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100"
            >
              <i className="fab fa-x-twitter text-2xl mb-1"></i>
              <span className="text-xs font-cottage">
                {t("footer.socialMedia.twitter")}
              </span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100"
            >
              <i className="fab fa-linkedin text-2xl mb-1"></i>
              <span className="text-xs font-cottage">
                {t("footer.socialMedia.linkedin")}
              </span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100"
            >
              <i className="fab fa-github text-2xl mb-1"></i>
              <span className="text-xs font-cottage">
                {t("footer.socialMedia.github")}
              </span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100"
            >
              <i className="fab fa-instagram text-2xl mb-1"></i>
              <span className="text-xs font-cottage">
                {t("footer.socialMedia.instagram")}
              </span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100"
            >
              <i className="fab fa-tiktok text-2xl mb-1"></i>
              <span className="text-xs font-cottage">
                {t("footer.socialMedia.tiktok")}
              </span>
            </a>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center text-xs tracking-wide opacity-60 border-t border-gray-200 font-cottage pt-4">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
