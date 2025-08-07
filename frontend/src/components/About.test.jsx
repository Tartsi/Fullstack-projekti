import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "./About";
import Header from "./Header";
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
    const description1 = screen.getByText(/Nopea ja tehokas palvelu/);
    expect(description1).toBeInTheDocument();

    const description2 = screen.getByText(
      /Palaat raikkaaseen ja puhtaaseen autoon/
    );
    expect(description2).toBeInTheDocument();
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

  it("renders transition arrow to explanation section", () => {
    render(<AboutWithProvider />);

    const transitionButton = screen.getByRole("button", {
      name: /scroll to explanation section/i,
    });
    expect(transitionButton).toBeInTheDocument();
  });

  it("changes language when language switched to English"),
    () => {
      render(
        <LanguageProvider>
          <Header />
          <About />
        </LanguageProvider>
      );

      // Get the main language selector (not in dropdown)
      const allFinElements = screen.getAllByText("FIN");
      const mainLanguageSelector = allFinElements[1].closest("div");

      // Find the English flag in the same container
      const languageContainer = mainLanguageSelector.parentElement;
      const englishOption = languageContainer
        .querySelector('[alt="English flag"]')
        .closest("div");

      // Click to switch language to English
      fireEvent.click(englishOption);

      // Check if the text is now in English
      expect(screen.getByText("About Us")).toBeInTheDocument();
    };
});
