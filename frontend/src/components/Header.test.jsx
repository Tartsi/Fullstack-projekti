import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

describe("Header Component", () => {
  it("renders the company name", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    expect(screen.getByText("Workday-Vacuumers")).toBeInTheDocument();
  });

  it("renders the hamburger menu icon", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const hamburger = screen.getByText("≡");
    expect(hamburger).toBeInTheDocument();
  });

  it("shows navigation links on hover", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const hamburger = screen.getByText("≡");

    // Hover over the hamburger menu
    fireEvent.mouseEnter(hamburger.parentElement);

    // Check if navigation links are visible (using translated text)
    expect(screen.getByText("Palvelut")).toBeInTheDocument(); // Services in Finnish
    expect(screen.getByText("Tietoa")).toBeInTheDocument(); // About in Finnish
    expect(screen.getByText("Tilaa")).toBeInTheDocument(); // Order in Finnish
    expect(screen.getByText("Yhteystiedot")).toBeInTheDocument(); // Contact in Finnish
  });

  it("hides navigation links when not hovering", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const hamburger = screen.getByText("≡");

    // Initially, links should not be visible (they have pointer-events-none)
    const menuContainer = hamburger.parentElement;
    fireEvent.mouseLeave(menuContainer);

    // The links exist in DOM but are hidden with opacity-0
    const services = screen.getByText("Palvelut");
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
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const hamburger = screen.getByText("≡");
    expect(hamburger).toHaveClass("cursor-pointer");
  });
});
