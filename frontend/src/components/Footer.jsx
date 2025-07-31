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

  // Social media configuration to reduce repetition
  const socialMediaLinks = [
    { icon: "fab fa-x-twitter", key: "twitter" },
    { icon: "fab fa-linkedin", key: "linkedin" },
    { icon: "fab fa-github", key: "github" },
    { icon: "fab fa-instagram", key: "instagram" },
    { icon: "fab fa-tiktok", key: "tiktok" },
  ];

  // Contact information array for easier maintenance
  const contactInfo = [
    t("footer.email"),
    t("footer.phone"),
    t("footer.address"),
  ];

  // Common hover effect classes
  const socialLinkClasses =
    "flex flex-col items-center hover:scale-110 transform transition-transform duration-300 opacity-70 hover:opacity-100";

  return (
    <footer id="footer" className="text-black py-8 font-light">
      <div className="max-w-screen-xl mx-auto px-8">
        {/* Large Centered Contact Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl tracking-widest uppercase italic underline decoration-2 underline-offset-4 font-cottage">
            {t("footer.contact")}
          </h2>
        </div>

        {/* Contact Information */}
        <div className="text-center mb-6">
          <div className="space-y-3 text-sm opacity-70 italic font-body">
            {contactInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center mb-2">
          <h3 className="text-sm tracking-wide uppercase italic mb-4 opacity-90 font-cottage">
            {t("footer.followUs")}
          </h3>
          <div className="flex justify-center space-x-8 mb-3">
            {socialMediaLinks.map((social) => (
              <a
                key={social.key}
                href="#"
                className={socialLinkClasses}
                aria-label={`Follow us on ${t(
                  `footer.socialMedia.${social.key}`
                )}`}
              >
                <i className={`${social.icon} text-2xl mb-1`}></i>
                <span className="text-xs font-body">
                  {t(`footer.socialMedia.${social.key}`)}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <div className="inline-block text-xs tracking-wide opacity-60 border-t border-black font-body pt-4">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
