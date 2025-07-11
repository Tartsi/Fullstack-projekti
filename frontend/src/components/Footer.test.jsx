import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";
import { LanguageProvider } from "../i18n/LanguageContext";

describe("Footer Component", () => {
  it("renders the contact header", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(screen.getByText("Yhteystiedot")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(
      screen.getByText("info@workday-siivouspalvelut.fi")
    ).toBeInTheDocument();
    expect(screen.getByText("+358 40 123 4567")).toBeInTheDocument();
    expect(
      screen.getByText("Siivoustie 123, 00100 Helsinki")
    ).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(
      screen.getByText("Seuraa Meitä Sosiaalisessa Mediassa!")
    ).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("TikTok")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(5); // 5 social media links

    // Check if Font Awesome icons are present
    expect(document.querySelector(".fa-x-twitter")).toBeInTheDocument();
    expect(document.querySelector(".fa-linkedin")).toBeInTheDocument();
    expect(document.querySelector(".fa-github")).toBeInTheDocument();
    expect(document.querySelector(".fa-instagram")).toBeInTheDocument();
    expect(document.querySelector(".fa-tiktok")).toBeInTheDocument();
  });

  it("renders copyright information with current year", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${currentYear} Workday-Vacuumers. Kaikki oikeudet pidätetään.`
      )
    ).toBeInTheDocument();
  });

  it("has correct styling for contact header", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const contactHeader = screen.getByRole("heading", { level: 2 });
    expect(contactHeader).toHaveClass(
      "text-2xl",
      "tracking-widest",
      "uppercase",
      "italic",
      "underline"
    );
  });

  it("social media links have hover effects", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const socialLinks = screen.getAllByRole("link");

    socialLinks.forEach((link) => {
      expect(link).toHaveClass(
        "hover:scale-110",
        "transition-transform",
        "duration-300"
      );
    });
  });

  it("has proper footer semantic structure", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass(
      "bg-transparent",
      "text-black",
      "py-8",
      "font-light"
    );
  });
});
