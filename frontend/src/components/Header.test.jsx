import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";

describe("Header Component", () => {
  it("renders the company name", () => {
    render(<Header />);
    expect(screen.getByText("Workday-Vacuumers")).toBeInTheDocument();
  });

  it("renders the hamburger menu icon", () => {
    render(<Header />);
    const hamburger = screen.getByText("≡");
    expect(hamburger).toBeInTheDocument();
  });

  it("shows navigation links on hover", () => {
    render(<Header />);
    const hamburger = screen.getByText("≡");

    // Hover over the hamburger menu
    fireEvent.mouseEnter(hamburger.parentElement);

    // Check if navigation links are visible
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("hides navigation links when not hovering", () => {
    render(<Header />);
    const hamburger = screen.getByText("≡");

    // Initially, links should not be visible (they have pointer-events-none)
    const menuContainer = hamburger.parentElement;
    fireEvent.mouseLeave(menuContainer);

    // The links exist in DOM but are hidden with opacity-0
    const link1 = screen.getByText("Link 1");
    expect(link1).toBeInTheDocument();
    // Check if the parent container has opacity-0 class
    expect(link1.closest(".opacity-0")).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("fixed", "top-0", "left-0", "w-full", "z-50");
  });

  it("hamburger icon is clickable", () => {
    render(<Header />);
    const hamburger = screen.getByText("≡");
    expect(hamburger).toHaveClass("cursor-pointer");
  });
});
