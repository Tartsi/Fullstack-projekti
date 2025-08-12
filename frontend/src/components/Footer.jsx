import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import lockSlashIcon from "../assets/icons/lock-slash-svgrepo-com.svg";
import unlockIcon from "../assets/icons/unlock-svgrepo-com.svg";

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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // IntersectionObserver for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add 0.5 second delay before triggering animations
          setTimeout(() => {
            setIsVisible(true);
          }, 500);
          observer.disconnect(); // Stop observing once triggered
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -200px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  // Common hover effect classes (slowed down by 25% more: 300ms → 500ms → 625ms)
  const socialLinkClasses =
    "flex flex-col items-center hover:scale-110 transform transition-transform duration-[625ms] opacity-70 hover:opacity-100";

  // Check if submit button should be disabled
  const isButtonDisabled = isSubmitting || !message.trim();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setSubmitStatus("error");
      return;
    }

    if (trimmedMessage.length > 150) {
      setSubmitStatus("error");
      return;
    }

    // Basic XSS protection - remove potentially dangerous characters
    const sanitizedMessage = trimmedMessage
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission (replace with actual API call later)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, just show success and clear form
      setSubmitStatus("success");
      setMessage("");

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setMessage(value);
      if (submitStatus === "error") {
        setSubmitStatus(null);
      }
    }
  };

  return (
    <footer ref={sectionRef} id="footer" className="text-black py-8 font-light">
      <div className="max-w-screen-xl mx-auto px-8">
        {/* Main Content Container - Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          {/* Contact Us Form - Left side on large screens, top on small screens */}
          <div
            className={`flex-1 lg:max-w-md w-1/2 mx-auto lg:mx-0 transition-all duration-[1250ms] ${
              isVisible
                ? "opacity-100 translate-y-0 lg:translate-x-0"
                : "opacity-0 translate-y-8 lg:translate-x-[-50px]"
            }`}
          >
            <div className="text-center lg:text-left mb-4">
              <h2 className="text-2xl tracking-widest uppercase italic underline decoration-2 underline-offset-4 font-cottage">
                {t("footer.contactUs.title")}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  placeholder={t("footer.contactUs.placeholder")}
                  className="w-full h-32 px-4 py-3 bg-gray-100 border-2 border-black rounded-lg resize-none 
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition-all duration-[375ms] text-sm font-body
                           placeholder:opacity-60 placeholder:italic"
                  disabled={isSubmitting}
                />
                <div className="absolute bottom-2 right-2 text-xs opacity-60">
                  {message.length}/150
                </div>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full py-3 px-6 bg-black text-white rounded-lg relative
                         transition-all duration-[625ms] text-sm font-cottage tracking-wide uppercase
                         ${
                           !isButtonDisabled
                             ? "hover:bg-gray-800 transform hover:scale-105"
                             : "bg-gray-400 cursor-not-allowed"
                         }`}
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? "..." : t("footer.contactUs.submit")}
                  <img
                    src={isButtonDisabled ? lockSlashIcon : unlockIcon}
                    alt={isButtonDisabled ? "Locked" : "Unlocked"}
                    className="absolute right-3 w-4 h-4 transition-all duration-[375ms] filter invert"
                  />
                </span>
              </button>

              {/* Status Messages */}
              {submitStatus && (
                <div
                  className={`text-center text-sm italic transition-opacity duration-[375ms] ${
                    submitStatus === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {submitStatus === "success"
                    ? t("footer.contactUs.success")
                    : t("footer.contactUs.error")}
                </div>
              )}
            </form>
          </div>

          {/* Vertical Separator Pillar - Only visible on large screens */}
          <div
            className={`hidden lg:block w-px bg-black self-stretch min-h-[200px] transition-all duration-[1250ms] delay-[975ms] ${
              isVisible ? "opacity-30" : "opacity-0"
            }`}
          ></div>

          {/* Contact Information and Social Media - Right side on large screens, bottom on small screens */}
          <div
            className={`flex-1 lg:max-w-md w-1/2 mx-auto lg:mx-0 transition-all duration-[1250ms] delay-[625ms] ${
              isVisible
                ? "opacity-100 translate-y-0 lg:translate-x-0"
                : "opacity-0 translate-y-8 lg:translate-x-[50px]"
            }`}
          >
            {/* Contact Information */}
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl tracking-widest uppercase italic underline decoration-2 underline-offset-4 font-cottage mb-4">
                {t("footer.contact")}
              </h2>

              <div className="space-y-3 text-sm opacity-70 italic font-body text-center lg:text-left">
                {contactInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="text-center lg:text-left">
              <h3 className="text-sm tracking-wide uppercase italic mb-4 opacity-90 font-cottage">
                {t("footer.followUs")}
              </h3>
              <div className="flex justify-center lg:justify-start space-x-8 mb-3">
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
          </div>
        </div>

        {/* Copyright - Bottom section */}
        <div
          className={`text-center mt-8 transition-all duration-[1250ms] delay-[875ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-1/2 lg:w-full mx-auto border-t border-black border-opacity-20 pt-6">
            <div className="inline-block text-xs tracking-wide opacity-60 font-body">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
