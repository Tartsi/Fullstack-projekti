import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";
import "@testing-library/jest-dom";

import PricingCalendar from "./PricingCalendar";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

// Test environment stubs and mocks

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // Simulate intersection immediately for testing
    callback([{ isIntersecting: true, target: element }]);
  }),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Framer Motion-passthrough - speeds up testing as animations are immediate
// Filter out motion-specific props to avoid React warnings
vi.mock("framer-motion", () => {
  const motionProps = [
    "initial",
    "animate",
    "exit",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileInView",
    "transition",
    "variants",
    "layout",
    "layoutId",
  ];

  const Passthrough = ({ children, ...props }) => {
    // Filter out motion-specific props
    const filteredProps = Object.keys(props).reduce((acc, key) => {
      if (!motionProps.includes(key)) {
        acc[key] = props[key];
      }
      return acc;
    }, {});

    return <div {...filteredProps}>{children}</div>;
  };

  return {
    motion: new Proxy(
      {},
      {
        get: () => Passthrough,
      }
    ),
    AnimatePresence: Passthrough,
  };
});

// Stub availability logic to be deterministic but keep rest of the calendar logic intact
// Day 3 will be selected in tests (Wednesday) when timeslots are always available
vi.mock("../utils/calendarUtils", async () => {
  const actual = await vi.importActual("../utils/calendarUtils");
  const mockedTimeSlots = [
    { id: "ts-1", label: "09:00 - 11:00" },
    { id: "ts-2", label: "11:00 - 13:00" },
    { id: "ts-3", label: "13:00 - 15:00" },
    { id: "ts-4", label: "15:00 - 17:00" },
  ];

  return {
    ...actual,
    timeSlots: mockedTimeSlots,
    // make dates available
    isDateAvailable: (date /*, availableDates */) => {
      const day = date.getDay(); // 0=sun, 1=mon, ... 6=sun
      return day >= 1 && day <= 5;
    },
    getAvailableTimeSlotsForDate: (/* date, availableDates */) =>
      mockedTimeSlots,
  };
});

// Clock for testing purposes
// Always locked to Monday 01.09.2025
const FIXED_NOW = new Date("2025-09-01T10:00:00.000Z");

// Helper function to render with providers
const renderWithProviders = (ui) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

// Begin tests
describe("PricingCalendar", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    // Make sure each test begins on a clean DOM
    document.body.innerHTML = "";
  });

  afterEach(() => {
    // Run possible waiting timers to end
    vi.runOnlyPendingTimers();
  });

  it("renders price and text in Finnish by default", async () => {
    renderWithProviders(<PricingCalendar />);

    // Wrap into act code that causes React state updates
    // In this case update to PricingCalendar
    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // The component should render with "49€" price
    const priceElement = screen.queryByText("49€");
    expect(priceElement).toBeInTheDocument();

    // Also check for Finnish text content
    const vatText = screen.queryByText("(ALV sisältyy)");
    expect(vatText).toBeInTheDocument();
  });

  it("changes language when language switched to English", async () => {
    render(
      <LanguageProvider>
        <Header />
        <PricingCalendar />
      </LanguageProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(600);
    });

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
    const engText = screen.queryByText("(VAT included)");
    expect(engText).toBeInTheDocument();
  });

  it("renders service title and description in Finnish", async () => {
    renderWithProviders(<PricingCalendar />);

    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // Check for service title
    const serviceTitle = screen.queryByText("Wocuuming");
    expect(serviceTitle).toBeInTheDocument();

    // Check for included services text
    const includedText = screen.queryByText("Hintaan sisältyy:");
    expect(includedText).toBeInTheDocument();

    // Check for specific service items
    const vacuuming = screen.queryByText("Imurointi");
    expect(vacuuming).toBeInTheDocument();

    const wiping = screen.queryByText("Pintojen pyyhintä");
    expect(wiping).toBeInTheDocument();
  });

  it("renders with proper styling and responsive classes", async () => {
    const { container } = renderWithProviders(<PricingCalendar />);

    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // Check that the main container has proper styling
    const sectionElement = container.querySelector(
      '[data-pricing-section="true"]'
    );
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement).toHaveClass("py-20", "px-4");
  });
});
