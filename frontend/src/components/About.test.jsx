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

  it("renders description paragraphs in centered layout", () => {
    render(<AboutWithProvider />);

    // Check for description text (partial match since it's long)
    const description1 = screen.getByText(/WOCUUMING eli Workday-Vacuuming/);
    expect(description1).toBeInTheDocument();
  });

  it("renders value proposition", () => {
    render(<AboutWithProvider />);

    const valueProposition = screen.getByText(
      /Siivoamme autosi sisätilat työpäivän aikana/
    );
    expect(valueProposition).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<AboutWithProvider />);

    const aboutSection = screen.getByRole("region");
    expect(aboutSection).toHaveAttribute("id", "about");

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
  });
});
