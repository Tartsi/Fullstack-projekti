import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock scrollTo function
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

// Helper function to render component with LanguageProvider
const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("Header", () => {
  it("renders the header component", () => {
    renderWithLanguageProvider(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders the language selector", () => {
    renderWithLanguageProvider(<Header />);

    // Check if the Finnish language selector is present by default
    const finElements = screen.getAllByText("FIN");
    expect(finElements.length).toBeGreaterThan(0);

    // Check if there are multiple Finnish flag elements
    const flagElements = screen.getAllByAltText("Finnish flag");
    expect(flagElements.length).toBeGreaterThan(0);
  });

  it("renders the hamburger menu icon", () => {
    renderWithLanguageProvider(<Header />);

    const hamburger = screen.getByText("≡");
    expect(hamburger).toBeInTheDocument();
  });

  it("shows navigation links on hover", () => {
    renderWithLanguageProvider(<Header />);

    const hamburger = screen.getByText("≡");

    // Hover over the hamburger menu
    fireEvent.mouseEnter(hamburger.parentElement);

    // Check if navigation links are visible
    expect(screen.getByText("Prosessi")).toBeInTheDocument();
    expect(screen.getByText("Tietoa")).toBeInTheDocument();
    expect(screen.getByText("Tilaa")).toBeInTheDocument();
    expect(screen.getByText("Yhteystiedot")).toBeInTheDocument();
  });

  it("hides navigation links when not hovering", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const hamburger = screen.getByText("≡");

    // Initially, links should not be visible
    const menuContainer = hamburger.parentElement;
    fireEvent.mouseEnter(menuContainer);
    fireEvent.mouseLeave(menuContainer);

    // The links exist in DOM but are hidden with opacity-0
    const services = screen.getByText("Prosessi");
    expect(services).toBeInTheDocument();
    // Check if the parent container has opacity-0 class
    expect(services.closest(".opacity-0")).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("fixed", "top-0", "left-0", "w-full", "z-50");
  });

  it("hamburger icon is clickable", () => {
    renderWithLanguageProvider(<Header />);

    const hamburger = screen.getByText("≡");
    expect(hamburger).toHaveClass("cursor-pointer");
  });

  it("switches all text to English when language selector is switched to English", () => {
    renderWithLanguageProvider(<Header />);

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

    // Check if all text switches to English (works this way because opacity is 0, so the elements exist in the DOM)
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
