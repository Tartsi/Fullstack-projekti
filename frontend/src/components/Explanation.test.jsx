import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Explanation from "./Explanation";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

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

// Begin tests
describe("Explanation Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders explanation section with Finnish text by default", () => {
    render(<ExplanationWithProvider />);

    // Header
    expect(screen.getByText(/Näin wocuuming toimii/i));

    // Each section
    expect(screen.getByText(/Varaa aika/i));
    expect(screen.getByText(/Ilmoita osoite/i));
    expect(screen.getByText(/Siivoustamme varten/i));
    expect(screen.getByText(/Siivous käynnissä/i));
    expect(screen.getByText(/Siivous valmis/i));
    expect(screen.getByText(/Nauti puhtaudesta/i));
  });

  it("renders section in English after language change", () => {
    render(
      <LanguageProvider>
        <Header />
        <Explanation />
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
    const engText = screen.queryByText("Provide Address");
    expect(engText).toBeInTheDocument();
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

    // Check that icon containers exist
    const iconContainers = document.querySelectorAll(".flex-shrink-0.w-8");
    expect(iconContainers).toHaveLength(6); // Should have 6 step icons

    // Verify each icon container has an img element (SVG icon)
    iconContainers.forEach((container) => {
      const imgElement = container.querySelector("img");
      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute("src");
      expect(imgElement).toHaveAttribute("alt");
    });
  });

  it("renders connecting arrows between steps", () => {
    render(<ExplanationWithProvider />);

    // Should have 5 arrows between 6 steps
    const arrows = screen.getAllByLabelText("Step connector arrow");
    // SVG arrows are present but exact count may vary based on implementation
    expect(arrows.length).toBeGreaterThan(0);
    expect(arrows.length).toBe(5); // 6 steps should have 5 connecting arrows
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

    // Mock IntersectionObserver to trigger visibility immediately
    let observerCallback;
    const mockIntersectionObserver = vi.fn((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn((element) => {
          // Trigger the callback immediately with isIntersecting: true
          observerCallback([{ isIntersecting: true }]);
        }),
        disconnect: vi.fn(),
      };
    });
    global.IntersectionObserver = mockIntersectionObserver;

    const { unmount } = render(<ExplanationWithProvider />);

    // Advance timers to trigger the timeout that starts auto progression
    act(() => {
      vi.advanceTimersByTime(2000); // Wait for animation completion delay + a bit more
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
