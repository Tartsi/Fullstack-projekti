import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Layout from "./Layout";
import { LanguageProvider } from "../i18n/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";

// Mock AuthContext
vi.mock("../contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => React.createElement("div", {}, children),
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
}));

// Mock child components that Layout uses
vi.mock("./Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock("./Footer", () => ({
  default: () => <div data-testid="footer">Footer Component</div>,
}));

vi.mock("./Hero", () => ({
  default: () => <div data-testid="hero">Hero Component</div>,
}));

vi.mock("./About", () => ({
  default: () => <div data-testid="about">About Component</div>,
}));

vi.mock("./Explanation", () => ({
  default: () => <div data-testid="explanation">Explanation Component</div>,
}));

vi.mock("./UserReviewSection", () => ({
  default: () => <div data-testid="user-reviews">User Reviews Component</div>,
}));

vi.mock("./PricingCalendar", () => ({
  default: () => (
    <div data-testid="pricing-calendar">Pricing Calendar Component</div>
  ),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Helper function to render component with all necessary providers
const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </AuthProvider>
  );
};

describe("Layout", () => {
  it("renders the layout component", () => {
    const { container } = renderWithProviders(<Layout />);

    // Find the div with the min-h-screen class (the main layout div)
    const layoutDiv = container.querySelector(".min-h-screen");
    expect(layoutDiv).toBeInTheDocument();
    expect(layoutDiv).toHaveClass("flex");
    expect(layoutDiv).toHaveClass("flex-col");
  });

  it("renders all required components", () => {
    renderWithProviders(<Layout />);

    // Check that all main sections are rendered
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("about")).toBeInTheDocument();
    expect(screen.getByTestId("explanation")).toBeInTheDocument();
    expect(screen.getByTestId("user-reviews")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-calendar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("applies correct CSS classes to layout container", () => {
    const { container } = renderWithProviders(<Layout />);

    // Find the div with the min-h-screen class (the main layout div)
    const layoutDiv = container.querySelector(".min-h-screen");

    expect(layoutDiv).toHaveClass("min-h-screen");
    expect(layoutDiv).toHaveClass("flex");
    expect(layoutDiv).toHaveClass("flex-col");
    expect(layoutDiv).toHaveClass("text-white");
    expect(layoutDiv).toHaveClass("font-cottage");
  });

  it("includes background image with correct attributes", () => {
    renderWithProviders(<Layout />);

    const backgroundImg = document.querySelector('img[aria-hidden="true"]');
    expect(backgroundImg).toBeInTheDocument();
    expect(backgroundImg).toHaveAttribute("alt", "");
    expect(backgroundImg).toHaveAttribute("loading", "eager");
    expect(backgroundImg).toHaveAttribute("decoding", "async");
  });

  it("renders components in correct order", () => {
    const { container } = renderWithProviders(<Layout />);

    const components = container.querySelectorAll("[data-testid]");
    const componentOrder = Array.from(components).map((el) =>
      el.getAttribute("data-testid")
    );

    expect(componentOrder).toEqual([
      "header",
      "hero",
      "about",
      "explanation",
      "user-reviews",
      "pricing-calendar",
      "footer",
    ]);
  });
});
