import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Hero from "./Hero";
import { LanguageProvider } from "../i18n/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import userEvent from "@testing-library/user-event";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Test wrapper with all providers
const TestWrapper = ({ children }) => (
  <LanguageProvider>
    <AuthProvider>{children}</AuthProvider>
  </LanguageProvider>
);

// Helper function to render component with providers
const renderWithProviders = (component) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

describe("Hero", () => {
  it("renders the hero section", () => {
    renderWithProviders(<Hero />);

    const heroSection = screen.getByRole("region");
    expect(heroSection).toBeInTheDocument();
  });

  it("displays the main headline in Finnish by default", () => {
    renderWithProviders(<Hero />);

    expect(
      screen.getByText("Siivoamme Autosi Työpäivän Aikana")
    ).toBeInTheDocument();
  });

  it("displays the subheadline in Finnish by default", () => {
    renderWithProviders(<Hero />);

    expect(
      screen.getByText(
        "Ammattitaitoinen auton sisäsiivous samalla, kun keskityt työhösi. Palaat kotiin puhtaalla autolla."
      )
    ).toBeInTheDocument();
  });

  it("displays call-to-action button in Finnish by default", () => {
    renderWithProviders(<Hero />);

    expect(screen.getByText("Lue Lisää")).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    renderWithProviders(<Hero />);

    // Check for main content area
    const main = screen.getByRole("region");
    expect(main).toBeInTheDocument();

    // Check for heading hierarchy
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent("Siivoamme Autosi Työpäivän Aikana");
  });

  it("has responsive design classes", () => {
    renderWithProviders(<Hero />);

    const heroSection = screen.getByRole("region");
    expect(heroSection).toHaveClass("min-h-screen");
    expect(heroSection).toHaveClass("flex");
    expect(heroSection).toHaveClass("items-center");
    expect(heroSection).toHaveClass("justify-center");
  });

  it("has call-to-action button with proper styling", () => {
    renderWithProviders(<Hero />);

    // Look for the "Lue Lisää" button
    const ctaButton = screen.getByRole("button", { name: /Lue Lisää/i });
    expect(ctaButton).toHaveClass("group");
    expect(ctaButton).toHaveClass("bg-brand-purple");
    expect(ctaButton).toHaveClass("hover:bg-brand-dark");
    expect(ctaButton).toHaveClass("px-8");
    expect(ctaButton).toHaveClass("py-4");
    expect(ctaButton).toHaveClass("rounded-full");
    expect(ctaButton).toHaveClass("transition-all");
    expect(ctaButton).toHaveClass("duration-300");
  });

  it("has proper visibility animation trigger", () => {
    renderWithProviders(<Hero />);

    // Hero uses useState for visibility, not IntersectionObserver
    const heroSection = screen.getByRole("region");
    expect(heroSection).toBeInTheDocument();

    // Check that animation classes are present
    const languageSelector = heroSection.querySelector(
      ".flex.justify-center.items-center.space-x-6"
    );
    expect(languageSelector).toHaveClass(
      "transition-all",
      "duration-1000",
      "delay-300"
    );
  });

  it("switches all text to English when language selector is switched to English", async () => {
    renderWithProviders(<Hero />);

    const user = userEvent.setup();
    await user.click(screen.getByAltText(/english flag/i));

    expect(
      await screen.findByText("We Clean Your Car During Workday")
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/car interior cleaning while you focus on work/i)
    ).toBeInTheDocument();
  });
});
