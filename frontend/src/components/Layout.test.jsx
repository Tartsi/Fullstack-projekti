import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Layout from "./Layout";

describe("Layout Component", () => {
  it("renders without crashing", () => {
    render(<Layout />);
    // Check if the main layout structure is present
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders Header component", () => {
    render(<Layout />);
    // Check if header is present by looking for the company name
    expect(screen.getByText("Workday-Vacuumers")).toBeInTheDocument();
  });

  it("renders Footer component", () => {
    render(<Layout />);
    // Check if footer is present by looking for contact section header (h2)
    expect(
      screen.getByRole("heading", { level: 2, name: "Contact" })
    ).toBeInTheDocument();
  });

  it("renders children content", () => {
    const TestChild = () => <div>Test Child Content</div>;
    render(
      <Layout>
        <TestChild />
      </Layout>
    );

    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(<Layout />);
    const layoutContainer = screen.getByRole("main").parentElement;
    expect(layoutContainer).toHaveClass(
      "min-h-screen",
      "flex",
      "flex-col",
      "bg-brand-lightgrey"
    );
  });

  it("main content area has flex-1 class", () => {
    render(<Layout />);
    const mainContent = screen.getByRole("main");
    expect(mainContent).toHaveClass("flex-1");
  });

  it("maintains proper semantic structure", () => {
    render(<Layout />);

    // Check for proper semantic elements
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // Footer
  });

  it("applies correct text color class", () => {
    render(<Layout />);
    const layoutContainer = screen.getByRole("main").parentElement;
    expect(layoutContainer).toHaveClass("text-white");
  });
});
