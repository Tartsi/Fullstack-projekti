import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import UserReviewSection from "./UserReviewSection";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // Simulate intersection immediately for testing
    callback([{ isIntersecting: true, target: element }]);
  }),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Helper provider
const UserReviewSectionWithProvider = () => (
  <LanguageProvider>
    <UserReviewSection />
  </LanguageProvider>
);

// Begin tests
describe("UserReviewSection Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders section with correct structure", () => {
    render(<UserReviewSectionWithProvider />);

    // Check for main section
    const reviewSection = screen.getByRole("region");
    expect(reviewSection).toBeInTheDocument();
    expect(reviewSection).toHaveAttribute("id", "reviews");
  });

  it("renders section headline and Finnish text by default", () => {
    render(<UserReviewSectionWithProvider />);

    const headline = screen.getByText("Wocuuming pelasti päiväni!");
    expect(headline).toBeInTheDocument();
  });

  it("renders section in English after language change", () => {
    render(
      <LanguageProvider>
        <Header />
        <UserReviewSection />
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
    const engText = screen.queryByText("Wocuuming polished my day!");
    expect(engText).toBeInTheDocument();
  });

  it("calculates average rating correctly", () => {
    render(<UserReviewSectionWithProvider />);

    // Expected average: (5 + 4 + 5 + 4 + 5) / 5 = 4.6
    const ratingText = screen.getAllByText("4.6 / 5")[0];
    expect(ratingText).toBeInTheDocument();
  });

  it("renders overall rating widget", () => {
    render(<UserReviewSectionWithProvider />);

    // Check for star SVG using data-testid approach would be better,
    // but for now just check for the rating text
    expect(screen.getAllByText("4.6 / 5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Kokonaisarvosana!")[0]).toBeInTheDocument();
  });

  it("renders navigation arrows", () => {
    render(<UserReviewSectionWithProvider />);

    // Should have left and right navigation arrows inside the center ReviewCard
    const leftArrows = screen.getAllByRole("button", {
      name: /previous review/i,
    });
    const rightArrows = screen.getAllByRole("button", { name: /next review/i });

    expect(leftArrows.length).toBeGreaterThan(0);
    expect(rightArrows.length).toBeGreaterThan(0);
  });

  it("renders first review by default", () => {
    render(<UserReviewSectionWithProvider />);

    // Should show first review (Ritva) somewhere in the component
    const ritvaElements = screen.getAllByText("Ritva");
    expect(ritvaElements.length).toBeGreaterThan(0);
  });

  it("has proper accessibility attributes", () => {
    render(<UserReviewSectionWithProvider />);

    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-labelledby", "reviews-title");

    const headline = screen.getByText("Wocuuming pelasti päiväni!");
    expect(headline.closest("h2")).toHaveAttribute("id", "reviews-title");
  });

  it("shows desktop and mobile layouts", () => {
    render(<UserReviewSectionWithProvider />);

    // Desktop carousel (should exist but be hidden on mobile)
    const desktopCarousel = document.querySelector(".hidden.lg\\:flex");
    expect(desktopCarousel).toBeInTheDocument();

    // Mobile carousel (should exist but be hidden on desktop)
    const mobileCarousel = document.querySelector(".lg\\:hidden");
    expect(mobileCarousel).toBeInTheDocument();
  });

  it("has correct entrance animation classes", () => {
    render(<UserReviewSectionWithProvider />);

    const headline = screen.getByText("Wocuuming pelasti päiväni!");
    expect(headline).toHaveClass(
      "transition-all",
      "duration-[1500ms]",
      "delay-[350ms]"
    );
  });

  it("renders review content correctly", () => {
    render(<UserReviewSectionWithProvider />);

    // Check that some review content is present (using getAllByText for multiple instances)
    expect(screen.getAllByText("Ritva").length).toBeGreaterThan(0);
    expect(screen.getAllByText("43 vuotta").length).toBeGreaterThan(0);

    // Check for comment text
    const commentElements = screen.getAllByText(
      /Olipa kätevä tapa saada autoni puhtaaksi/
    );
    expect(commentElements.length).toBeGreaterThan(0);
  });
});
