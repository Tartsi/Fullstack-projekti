import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    // Check if the app renders the main layout structure
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the Layout component", () => {
    render(<App />);
    // Check if Layout is rendered by looking for header and footer
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // Footer
  });

  it("renders the company name in header", () => {
    render(<App />);
    // Use getAllByText to get all instances and check the header one specifically
    const companyNames = screen.getAllByText("Workday-Vacuumers");
    expect(companyNames.length).toBeGreaterThan(0);
    // Check that at least one is in the header
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("has correct background styling", () => {
    render(<App />);
    const appContainer = screen.getByRole("main").parentElement;
    expect(appContainer).toHaveClass("bg-brand-lightgrey");
  });

  it("renders contact section in footer", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Yhteystiedot" })
    ).toBeInTheDocument();
  });
});
