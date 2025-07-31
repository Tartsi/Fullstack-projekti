import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "./Hero";
import { LanguageProvider } from "../i18n/LanguageContext";

describe("Hero Component", () => {
  it("renders without crashing", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    expect(screen.getByText("Lue Lisää")).toBeInTheDocument();
  });

  it("renders the main headline", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    expect(
      screen.getByText("Siivoamme Autosi Työpäivän Aikana")
    ).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    expect(
      screen.getByText(
        "Ammattitaitoinen auton sisäsiivous samalla, kun keskityt työhösi. Palaat kotiin puhtaalla autolla."
      )
    ).toBeInTheDocument();
  });

  it("renders the learn more button", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const learnMoreButton = screen.getByText("Lue Lisää");
    expect(learnMoreButton).toBeInTheDocument();
  });

  it("renders the company brand name", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    expect(screen.getByText("Workday-Vacuumers")).toBeInTheDocument();
  });

  it("renders the scroll indicator", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    expect(screen.getByText("Lue Lisää")).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const heroSection = document.querySelector("section");
    expect(heroSection).toHaveClass(
      "relative",
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center"
    );
  });

  it("Learn More button has hover effects", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const learnMoreButton = screen.getByText("Lue Lisää").closest("button");
    expect(learnMoreButton).toHaveClass(
      "hover:bg-brand-dark",
      "hover:scale-105",
      "transition-all"
    );
  });

  it("Learn More button is clickable", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const learnMoreButton = screen.getByText("Lue Lisää").closest("button");
    expect(learnMoreButton).toHaveClass("cursor-pointer");
  });

  it("renders brand icons", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const carIcon = screen.getByAltText("Car");
    const vacuumIcon = screen.getByAltText("Vacuum");
    expect(carIcon).toBeInTheDocument();
    expect(vacuumIcon).toBeInTheDocument();
  });

  it("renders language selector with flags", () => {
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>
    );
    const finnishFlag = screen.getByAltText("Finnish flag");
    const englishFlag = screen.getByAltText("English flag");
    expect(finnishFlag).toBeInTheDocument();
    expect(englishFlag).toBeInTheDocument();
    expect(screen.getByText("FIN")).toBeInTheDocument();
    expect(screen.getByText("ENG")).toBeInTheDocument();
  });
});
