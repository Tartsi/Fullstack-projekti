import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "./About";
import { LanguageProvider } from "../i18n/LanguageContext";

const AboutWithProvider = () => (
  <LanguageProvider>
    <About />
  </LanguageProvider>
);

describe("About Component", () => {
  it("renders about section with correct structure", () => {
    render(<AboutWithProvider />);

    // Check for the main section
    const aboutSection = screen.getByRole("region");
    expect(aboutSection).toBeInTheDocument();
    expect(aboutSection).toHaveAttribute("id", "about");
  });

  it("renders the title", () => {
    render(<AboutWithProvider />);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("renders the placeholder image container", () => {
    render(<AboutWithProvider />);

    const placeholderImage = screen.getByText("Siivouspalvelu työssä");
    expect(placeholderImage).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<AboutWithProvider />);

    const aboutSection = screen.getByRole("region");
    expect(aboutSection).toHaveAttribute("id", "about");

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
  });
});
