import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { smoothScrollToElement, easingFunctions } from "../utils/scrollUtils";
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
  ];

  // Contact information array for easier maintenance
  const contactInfo = [
    t("footer.email"),
    t("footer.phone"),
    t("footer.address"),
  ];

  // Common hover effect classes
  const socialLinkClasses =
    "flex flex-col items-center hover:scale-110 transform transition-transform duration-[625ms] opacity-70 hover:opacity-100";

  // Check if submit button should be disabled
  const isButtonDisabled =
    isSubmitting || !message.trim() || submitStatus !== null;

  // Handle form submission with client-side sanitizations
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

    // XSS and injection protection
    const sanitizedMessage = trimmedMessage
      // Remove script tags and their content (case insensitive)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove all HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove javascript: protocol
      .replace(/javascript:/gi, "")
      // Remove event handlers (onclick, onload, etc.)
      .replace(/on\w+\s*=/gi, "")
      // Remove data: protocol (potential for data URLs)
      .replace(/data:/gi, "")
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, "")
      // Remove file: protocol
      .replace(/file:/gi, "")
      // Remove expression() CSS function
      .replace(/expression\s*\(/gi, "")
      // Remove @import CSS directive
      .replace(/@import/gi, "")
      // Remove url() CSS function
      .replace(/url\s*\(/gi, "")
      // Remove potential NoSQL injection patterns
      .replace(/\$\w+/g, "")
      // Remove potential template injection patterns
      .replace(/\{\{.*\}\}/g, "")
      .replace(/\$\{.*\}/g, "")
      // Remove null bytes
      .replace(/\0/g, "")
      // Remove control characters except newlines and tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Limit consecutive special characters
      .replace(/[!@#$%^&*()_+=\[\]{}|;':",./<>?`~]{4,}/g, "...")
      // Remove potential path traversal attempts
      .replace(/\.\./g, "");

    // Additional validation: Check for suspicious patterns
    const suspiciousPatterns = [
      /eval\s*\(/i,
      /function\s*\(/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      /alert\s*\(/i,
      /confirm\s*\(/i,
      /prompt\s*\(/i,
      /document\./i,
      /window\./i,
      /location\./i,
      /history\./i,
      /navigator\./i,
      /\.innerHTML/i,
      /\.outerHTML/i,
      /\.write/i,
      /\.writeln/i,
    ];

    const containsSuspiciousContent = suspiciousPatterns.some((pattern) =>
      pattern.test(sanitizedMessage)
    );

    if (containsSuspiciousContent) {
      setSubmitStatus("error");
      return;
    }

    // Check for excessive special characters or numbers (potential bot behavior)
    const specialCharCount = (
      sanitizedMessage.match(/[^a-zA-ZåäöÅÄÖ\s.,!?]/g) || []
    ).length;
    const totalLength = sanitizedMessage.length;

    if (totalLength > 0 && specialCharCount / totalLength > 0.3) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission (replace with actual API call later if project goes further)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, just show success and clear form
      setSubmitStatus("success");
      setMessage("");

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus("error");
      // Clear error message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
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

  // Smooth scroll to top using scrollUtils with ultra slow animation
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition; // Negative because we're going to top
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const duration = 2500; // 2.5 seconds for ultra smooth experience

      // Use easeInOutCubic for the smoothest experience
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easingFunctions.easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  return (
    <footer ref={sectionRef} id="footer" className="text-black py-8 font-light">
      <div className="max-w-screen-xl mx-auto px-8">
        {/* Main Content Container - Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 lg:gap-6">
          {/* Contact Us Form - Left side on large screens, top on small screens */}
          <div
            className={`flex-1 lg:max-w-sm w-1/2 mx-auto lg:mx-0 lg:mr-3 transition-all duration-[1250ms] ${
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
              <div
                className={`relative transition-all duration-1000 ease-in-out ${
                  submitStatus
                    ? "pointer-events-none select-none"
                    : "pointer-events-auto select-auto"
                }`}
              >
                {/* Overlay for grayed-out effect - only over textarea */}
                <div
                  className={`absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg z-10 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                    submitStatus ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                  style={{ pointerEvents: submitStatus ? "all" : "none" }}
                >
                  {/* Status Message in center of textarea overlay */}
                  <div
                    className={`text-center text-lg font-medium transition-all duration-1000 ease-in-out transform ${
                      submitStatus
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-75 translate-y-4"
                    } ${
                      submitStatus === "success"
                        ? "text-green-100 bg-green-600 bg-opacity-90"
                        : "text-red-100 bg-red-600 bg-opacity-90"
                    } px-6 py-4 rounded-lg shadow-lg border-2 ${
                      submitStatus === "success"
                        ? "border-green-300"
                        : "border-red-300"
                    }`}
                  >
                    {submitStatus === "success"
                      ? t("footer.contactUs.success")
                      : submitStatus === "error"
                      ? t("footer.contactUs.error")
                      : ""}
                  </div>
                </div>

                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  placeholder={t("footer.contactUs.placeholder")}
                  className={`w-full h-32 px-4 py-3 bg-gray-100 border-2 border-black rounded-lg resize-none 
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition-all duration-1000 text-sm font-body
                           placeholder:opacity-60 placeholder:italic ${
                             submitStatus ? "opacity-50" : "opacity-100"
                           }`}
                  disabled={isSubmitting || submitStatus !== null}
                />
                <div
                  className={`absolute bottom-2 right-2 text-xs transition-opacity duration-1000 ${
                    submitStatus ? "opacity-30" : "opacity-60"
                  }`}
                >
                  {message.length}/150
                </div>
              </div>

              {/* Submit button for feedback */}
              <button
                type="submit"
                disabled={isButtonDisabled || submitStatus !== null}
                className={`w-full py-3 px-6 rounded-lg relative
                         transition-all duration-1500 ease-out text-sm font-cottage tracking-wide uppercase ${
                           !isButtonDisabled && submitStatus === null
                             ? "bg-blue-600 text-white hover:bg-brand-purple transform hover:scale-105 cursor-pointer"
                             : "bg-gray-400 text-white cursor-not-allowed"
                         } ${
                  submitStatus
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? "..." : t("footer.contactUs.submit")}
                  <img
                    src={
                      isButtonDisabled || submitStatus !== null
                        ? lockSlashIcon
                        : unlockIcon
                    }
                    alt={
                      isButtonDisabled || submitStatus !== null
                        ? "Locked"
                        : "Unlocked"
                    }
                    className={`absolute right-3 w-4 h-4 filter invert transition-all duration-1500 ease-out ${
                      !isButtonDisabled && submitStatus === null
                        ? "animate-bounce"
                        : ""
                    }`}
                    style={{
                      animationDuration:
                        isButtonDisabled || submitStatus !== null ? "0s" : "2s",
                      animationIterationCount:
                        isButtonDisabled || submitStatus !== null
                          ? "0"
                          : "infinite",
                    }}
                  />
                </span>
              </button>
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
            className={`flex-1 lg:max-w-sm w-1/2 mx-auto lg:mx-0 lg:ml-3 transition-all duration-[1250ms] delay-[625ms] ${
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
                    href={
                      social.key === "linkedin"
                        ? "https://www.linkedin.com/in/tarvo-lilja-b70637373/"
                        : social.key === "github"
                        ? "https://github.com/Tartsi"
                        : "#"
                    }
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
          <div className="w-1/2 lg:w-216 mx-auto border-t border-black border-opacity-20 pt-6">
            {/* Mobile: Back to Top Button above copyright */}
            <div className="lg:hidden flex justify-center mb-4">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 cursor-pointer text-xs tracking-wide opacity-60 hover:opacity-100 transition-all duration-500 hover:scale-110 transform group"
                aria-label={t("footer.backToTop")}
              >
                <div className="animate-bounce group-hover:animate-pulse">
                  <svg
                    className="w-4 h-4 transform rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-body">{t("footer.backToTop")}</span>
              </button>
            </div>

            {/* Desktop: Copyright centered with Back to Top on the right */}
            <div className="hidden lg:block">
              <div className="relative flex justify-center">
                {/* Copyright - Centered */}
                <div className="text-xs tracking-wide opacity-60 font-body">
                  © {new Date().getFullYear()} {t("footer.copyright")}
                </div>

                {/* Back to Top Button - Positioned to the right (Desktop only) */}
                <button
                  onClick={scrollToTop}
                  className="absolute right-0 flex items-center gap-2 cursor-pointer text-xs tracking-wide opacity-60 hover:opacity-100 transition-all duration-500 hover:scale-110 transform group"
                  aria-label={t("footer.backToTop")}
                >
                  <div className="animate-bounce group-hover:animate-pulse">
                    <svg
                      className="w-4 h-4 transform rotate-180"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-body">{t("footer.backToTop")}</span>
                </button>
              </div>
            </div>

            {/* Mobile: Copyright centered below Back to Top */}
            <div className="lg:hidden text-center">
              <div className="text-xs tracking-wide opacity-60 font-body">
                © {new Date().getFullYear()} {t("footer.copyright")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
