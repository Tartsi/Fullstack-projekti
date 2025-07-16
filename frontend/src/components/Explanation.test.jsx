import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Explanation from "./Explanation";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock the custom hooks and utilities
vi.mock("../hooks/useAnimations", () => ({
  useIntersectionAnimation: () => ({
    isVisible: true,
    sectionRef: { current: null },
    getAnimationClass: vi.fn(() => "opacity-100 translate-y-0"),
  }),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const ExplanationWithProvider = () => (
  <LanguageProvider>
    <Explanation />
  </LanguageProvider>
);

describe("Explanation Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders explanation section with correct structure", () => {
    render(<ExplanationWithProvider />);

    // Check for the main section
    const explanationSection = screen.getByRole("region");
    expect(explanationSection).toBeInTheDocument();
    expect(explanationSection).toHaveAttribute("id", "explanation");
  });

  it("renders the title", () => {
    render(<ExplanationWithProvider />);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("id", "explanation-title");
  });

  it("renders all 6 process steps", () => {
    render(<ExplanationWithProvider />);

    // Check for all 6 steps by looking for step numbers
    for (let i = 1; i <= 6; i++) {
      const stepNumber = screen.getByText(i.toString());
      expect(stepNumber).toBeInTheDocument();
    }
  });

  it("renders step icons", () => {
    render(<ExplanationWithProvider />);

    // Check for some of the step icons (emojis)
    expect(screen.getByText("📅")).toBeInTheDocument(); // Step 1
    expect(screen.getByText("📍")).toBeInTheDocument(); // Step 2
    expect(screen.getByText("🔓")).toBeInTheDocument(); // Step 3
    expect(screen.getByText("⏱️")).toBeInTheDocument(); // Step 4
    expect(screen.getByText("✅")).toBeInTheDocument(); // Step 5
    expect(screen.getByText("😊")).toBeInTheDocument(); // Step 6
  });

  it("renders connecting arrows between steps", () => {
    render(<ExplanationWithProvider />);

    // Should have 5 arrows between 6 steps
    const arrows = screen.getAllByLabelText("Step connector arrow");
    // SVG arrows are present but exact count may vary based on implementation
    expect(arrows.length).toBeGreaterThan(0);
    expect(arrows.length).toBe(5); // 6 steps should have 5 connecting arrows
  });

  it("renders call to action button", () => {
    render(<ExplanationWithProvider />);

    const ctaButton = screen.getByRole("button");
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveClass("bg-brand-green");
  });

  it("has proper accessibility attributes", () => {
    render(<ExplanationWithProvider />);

    const explanationSection = screen.getByRole("region");
    expect(explanationSection).toHaveAttribute(
      "aria-labelledby",
      "explanation-title"
    );

    // Check for step aria-labels
    const stepElements = screen.getAllByLabelText(/Vaihe \d:/);
    expect(stepElements).toHaveLength(6);
  });

  it("starts with first step active (index 0)", () => {
    render(<ExplanationWithProvider />);

    // The first step container should have scale-110 class (active state)
    const firstStep = screen.getByLabelText(/Vaihe 1:/);
    expect(firstStep).toHaveClass("scale-110");
  });

  it("cleans up intervals on unmount", () => {
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    const { unmount } = render(<ExplanationWithProvider />);

    // Wait for component to initialize and start interval
    act(() => {
      vi.advanceTimersByTime(1500); // Animation completion delay
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("has correct responsive classes", () => {
    render(<ExplanationWithProvider />);

    const section = screen.getByRole("region");
    expect(section).toHaveClass(
      "py-8",
      "sm:py-12",
      "lg:py-16",
      "px-4",
      "sm:px-6",
      "md:px-8"
    );
  });

  it("renders with overflow hidden for animations", () => {
    render(<ExplanationWithProvider />);

    const section = screen.getByRole("region");
    expect(section).toHaveClass("overflow-hidden");
  });
});
