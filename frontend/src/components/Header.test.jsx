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
  describe("Navigation Link Menu", () => {
    it("renders the header component", () => {
      renderWithLanguageProvider(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
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
      renderWithLanguageProvider(<Header />);

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

    it("hides navigation links when user touches outside of the menu on mobile devices", () => {
      renderWithLanguageProvider(<Header />);

      // Open navigation link on mobile
      const hamburger = screen.getByText("≡");
      fireEvent.click(hamburger);

      // Ensure menus are visible
      expect(screen.getByText("Prosessi")).toBeInTheDocument();

      // Simulate touch outside of the menu
      fireEvent.mouseDown(document.body);

      // Ensure menu is hidden
      const processLink = screen.getByText("Prosessi");

      expect(processLink.closest(".opacity-0")).toBeInTheDocument();
    });

    it("has correct styling classes", () => {
      renderWithLanguageProvider(<Header />);

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

  describe("Language Selector Menu", () => {
    it("renders the language selector", () => {
      renderWithLanguageProvider(<Header />);

      // Check if the Finnish language selector is present by default
      const finElements = screen.getAllByText("FIN");
      expect(finElements.length).toBeGreaterThan(0);

      // Check if there are multiple Finnish flag elements
      const flagElements = screen.getAllByAltText("Finnish flag");
      expect(flagElements.length).toBeGreaterThan(0);
    });
    it("shows language options on hover", () => {
      renderWithLanguageProvider(<Header />);

      // Find the language selector container
      const languageSelector = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');

      // Hover over the language selector
      fireEvent.mouseEnter(languageSelector);

      // Check if both language options are visible
      const finOptions = screen.getAllByText("FIN");
      const engOptions = screen.getAllByText("ENG");

      expect(finOptions.length).toBeGreaterThan(1); // Main selector + dropdown option
      expect(engOptions.length).toBeGreaterThan(0); // Dropdown option
    });

    it("hides language options when not hovering", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');

      // Hover and then leave
      fireEvent.mouseEnter(languageSelector);
      fireEvent.mouseLeave(languageSelector);

      // The language menu should have opacity-0 class when hidden
      const languageMenu = languageSelector.querySelector(".opacity-0");
      expect(languageMenu).toBeInTheDocument();
    });

    it("opens language menu when language selector is clicked", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen.getAllByText("FIN")[0].closest("div");

      // Click to open the menu
      fireEvent.click(languageSelector);

      // Check if both language options are visible
      const finOptions = screen.getAllByText("FIN");
      const engOptions = screen.getAllByText("ENG");

      expect(finOptions.length).toBeGreaterThan(1);
      expect(engOptions.length).toBeGreaterThan(0);
    });

    it("closes language menu when clicking outside menu on mobile", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen.getAllByText("FIN")[0].closest("div");

      // Click to open the menu
      fireEvent.click(languageSelector);

      // Verify menu is open by checking for multiple FIN elements
      expect(screen.getAllByText("FIN").length).toBeGreaterThan(1);

      // Click outside to close
      fireEvent.mouseDown(document.body);

      // The language menu should be hidden (have opacity-0 class)
      const languageContainer = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');
      const hiddenMenu = languageContainer.querySelector(".opacity-0");
      expect(hiddenMenu).toBeInTheDocument();
    });

    it("closes language menu when a language is selected", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen.getAllByText("FIN")[0].closest("div");

      // Click to open the menu
      fireEvent.click(languageSelector);

      // Find and click the English option
      const englishFlag = screen.getByAltText("English flag");
      const englishOption = englishFlag.closest("div");
      fireEvent.click(englishOption);

      // Menu should be closed after language change
      // Check that navigation text changed to English (confirming language changed)
      expect(screen.getByText("Process")).toBeInTheDocument();

      // And menu should be hidden
      const languageContainer = screen
        .getAllByText("ENG")[0]
        .closest('[data-menu="language"]');
      const hiddenMenu = languageContainer.querySelector(".opacity-0");
      expect(hiddenMenu).toBeInTheDocument();
    });

    it("highlights the currently selected language", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');

      // Hover to show the menu
      fireEvent.mouseEnter(languageSelector);

      // Find the Finnish option in the dropdown (should be highlighted by default)
      const dropdownFinFlags = screen.getAllByAltText("Finnish flag");
      const dropdownFinOption = dropdownFinFlags.find((flag) =>
        flag.closest("div").className.includes("opacity-100")
      );

      expect(dropdownFinOption).toBeInTheDocument();
    });

    it("language selector is clickable", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen.getAllByText("FIN")[0].closest("div");
      expect(languageSelector).toHaveClass("cursor-pointer");
    });

    it("displays correct flag images for each language", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');

      // Hover to show the menu
      fireEvent.mouseEnter(languageSelector);

      // Check that both flag images are present
      expect(screen.getAllByAltText("Finnish flag").length).toBeGreaterThan(0);
      expect(screen.getByAltText("English flag")).toBeInTheDocument();
    });

    it("maintains proper z-index for language menu", () => {
      renderWithLanguageProvider(<Header />);

      const languageSelector = screen
        .getAllByText("FIN")[0]
        .closest('[data-menu="language"]');

      // Hover to show the menu
      fireEvent.mouseEnter(languageSelector);

      // Check that the menu has high z-index class
      const languageMenu = languageSelector.querySelector(".z-50");
      expect(languageMenu).toBeInTheDocument();
    });
  });
});
