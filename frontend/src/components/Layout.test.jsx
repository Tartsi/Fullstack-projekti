import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Layout from "./Layout";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock child components
vi.mock("./Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock("./Footer", () => ({
  default: () => <div data-testid="footer">Footer Component</div>,
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Helper function to render component with LanguageProvider
const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("Layout", () => {
  it("renders the layout component", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    const layout = screen.getByTestId("test-children").closest("div");
    expect(layout).toBeInTheDocument();
  });

  it("renders the Header component", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders the Footer component", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders children content", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    expect(screen.getByTestId("test-children")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    // Check for proper semantic HTML structure
    const header = screen.getByTestId("header");
    const footer = screen.getByTestId("footer");
    const main = screen.getByTestId("test-children");

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it("applies correct CSS classes to layout container", () => {
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );

    const { container } = renderWithLanguageProvider(
      <Layout>
        <TestChildren />
      </Layout>
    );

    const layoutContainer = container.firstChild;
    expect(layoutContainer).toHaveClass("min-h-screen");
    expect(layoutContainer).toHaveClass("flex");
    expect(layoutContainer).toHaveClass("flex-col");
  });

  it("handles multiple children", () => {
    const FirstChild = () => <div data-testid="first-child">First Child</div>;
    const SecondChild = () => (
      <div data-testid="second-child">Second Child</div>
    );

    renderWithLanguageProvider(
      <Layout>
        <FirstChild />
        <SecondChild />
      </Layout>
    );

    expect(screen.getByTestId("first-child")).toBeInTheDocument();
    expect(screen.getByTestId("second-child")).toBeInTheDocument();
    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    renderWithLanguageProvider(<Layout />);

    // Header and Footer should still render
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
