import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Layout from "./Layout";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("Layout Component", () => {
  it("renders without crashing", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    // Check if the main layout structure is present
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders Header component", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    // Check if header is present by looking for the banner role
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders Footer component", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    // Check if footer is present by looking for contact section header (h2) in Finnish
    expect(
      screen.getByRole("heading", { level: 2, name: "Yhteystiedot" })
    ).toBeInTheDocument();
  });

  it("renders children content", () => {
    const TestChild = () => <div>Test Child Content</div>;
    render(
      <LanguageProvider>
        <Layout>
          <TestChild />
        </Layout>
      </LanguageProvider>
    );

    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    const layoutContainer = screen.getByRole("main").parentElement;
    expect(layoutContainer).toHaveClass(
      "min-h-screen",
      "flex",
      "flex-col",
      "text-white",
      "font-cottage"
    );
  });

  it("main content area has flex-1 class", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    const mainContent = screen.getByRole("main");
    expect(mainContent).toHaveClass("flex-1");
  });

  it("maintains proper semantic structure", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );

    // Check for proper semantic elements
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // Footer
  });

  it("applies correct text color class", () => {
    render(
      <LanguageProvider>
        <Layout />
      </LanguageProvider>
    );
    const layoutContainer = screen.getByRole("main").parentElement;
    expect(layoutContainer).toHaveClass("text-white");
  });
});
