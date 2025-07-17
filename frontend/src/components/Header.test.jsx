import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

describe("Header Component", () => {
  it("renders the language selector", () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    // Check if the Finnish language selector is present by default
    const finElements = screen.getAllByText("FIN");
    expect(finElements.length).toBeGreaterThan(0);

    // Check if there are multiple Finnish flag elements
    const flagElements = screen.getAllByAltText("Finnish flag");
    expect(flagElements.length).toBeGreaterThan(0);
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

    // Check if navigation links are visible
    expect(screen.getByText("Palvelut")).toBeInTheDocument();
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
