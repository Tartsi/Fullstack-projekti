import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders the contact header", () => {
    render(<Footer />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Footer />);
    expect(screen.getByText("info@workday-vacuumers.com")).toBeInTheDocument();
    expect(screen.getByText("+358 00 000 0000")).toBeInTheDocument();
    expect(
      screen.getByText("123 Clean Street, Spotless City, 00100")
    ).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(<Footer />);
    expect(screen.getByText("Follow Us On Social Media!")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("TikTok")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(5); // 5 social media links

    // Check if Font Awesome icons are present
    expect(document.querySelector(".fa-x-twitter")).toBeInTheDocument(); // Twitter
    expect(document.querySelector(".fa-linkedin")).toBeInTheDocument(); // LinkedIn
    expect(document.querySelector(".fa-github")).toBeInTheDocument(); // GitHub
    expect(document.querySelector(".fa-instagram")).toBeInTheDocument(); // Instagram
    expect(document.querySelector(".fa-tiktok")).toBeInTheDocument(); // TikTok
  });

  it("renders copyright information with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${currentYear} Workday-Vacuumers. All rights reserved.`
      )
    ).toBeInTheDocument();
  });

  it("has correct styling for contact header", () => {
    render(<Footer />);
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
    render(<Footer />);
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
    render(<Footer />);
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
