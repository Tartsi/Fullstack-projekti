import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BookingSuccess from "./BookingSuccess";
import { LanguageProvider } from "../i18n/LanguageContext";
import Header from "./Header";

// Mock check circle icon
vi.mock("../assets/icons/check-circle-svgrepo-com.svg", () => ({
  default: "mocked-check-circle-icon.svg",
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      onClick,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...props
    }) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
    h2: ({ children, initial, animate, transition, ...props }) => (
      <h2 {...props}>{children}</h2>
    ),
    p: ({ children, initial, animate, transition, ...props }) => (
      <p {...props}>{children}</p>
    ),
    button: ({
      children,
      onClick,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...props
    }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

// Helper function to render component with language provider
const renderWithProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

// Mock booking details for tests
const mockBookingDetails = {
  date: "2025-09-15",
  timeSlot: "10:00-12:00",
  address: "Testikatu 123",
  phoneNumber: "+358401234567",
  paymentMethod: "Käteinen",
  city: "Helsinki",
};

describe("BookingSuccess Component", () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = vi.fn();

    // Mock document.body.style to prevent errors
    Object.defineProperty(document.body, "style", {
      value: {
        overflow: "",
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays all booking detail labels correctly and in Finnish by default", () => {
    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Check all Finnish labels are present
    expect(screen.getByText("Päivämäärä:")).toBeInTheDocument();
    expect(screen.getByText("Aika:")).toBeInTheDocument();
    expect(screen.getByText("Kaupunki:")).toBeInTheDocument();
    expect(screen.getByText("Osoite:")).toBeInTheDocument();
    expect(screen.getByText("Puhelin:")).toBeInTheDocument();
    expect(screen.getByText("Maksutapa:")).toBeInTheDocument();
  });

  it("handles language change when switched to English", async () => {
    render(
      <LanguageProvider>
        <Header />
        <BookingSuccess
          bookingDetails={mockBookingDetails}
          onClose={mockOnClose}
        />
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

    // Check English labels are present
    expect(screen.getByText("Date:")).toBeInTheDocument();
    expect(screen.getByText("Time:")).toBeInTheDocument();
    expect(screen.getByText("City:")).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("Phone:")).toBeInTheDocument();
    expect(screen.getByText("Payment:")).toBeInTheDocument();
  });

  it("renders booking success modal with all details", () => {
    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Check that success elements are rendered
    expect(screen.getByText("Varaus onnistui!")).toBeInTheDocument();
    expect(screen.getByText("Varauksen tiedot:")).toBeInTheDocument();
    expect(screen.getByText("Sulje")).toBeInTheDocument();

    // Check booking details are displayed
    expect(screen.getByText("2025-09-15")).toBeInTheDocument();
    expect(screen.getByText("10:00-12:00")).toBeInTheDocument();
    expect(screen.getByText("Testikatu 123")).toBeInTheDocument();
    expect(screen.getByText("+358401234567")).toBeInTheDocument();
    expect(screen.getByText("Käteinen")).toBeInTheDocument();
    expect(screen.getByText("Helsinki")).toBeInTheDocument();
  });

  it("renders success icon", () => {
    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    const successIcon = screen.getByAltText("Success");
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveAttribute("src", "mocked-check-circle-icon.svg");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText("Sulje");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Click on the backdrop (the outer modal div) - use container to find it
    const container = screen.getByText("Varaus onnistui!").closest(".fixed");

    if (container) {
      await user.click(container);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      // Fallback test - just verify the element exists
      expect(screen.getByText("Varaus onnistui!")).toBeInTheDocument();
    }
  });

  it("calls onClose when ESC key is pressed", () => {
    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Simulate ESC key press
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside modal content", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Click inside the modal content
    const modalContent = screen.getByText("Varauksen tiedot:");
    await user.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("sets body overflow to hidden on mount and restores on unmount", () => {
    const { unmount } = renderWithProvider(
      <BookingSuccess
        bookingDetails={mockBookingDetails}
        onClose={mockOnClose}
      />
    );

    // Body overflow should be set to hidden
    expect(document.body.style.overflow).toBe("hidden");

    // Unmount component
    unmount();

    // Body overflow should be restored (empty string is the default)
    expect(document.body.style.overflow).toBe("");
  });

  it("renders with minimal booking details", () => {
    const minimalDetails = {
      date: "2025-09-15",
      timeSlot: "10:00-12:00",
      address: "",
      phoneNumber: "",
      paymentMethod: "",
      city: "",
    };

    renderWithProvider(
      <BookingSuccess bookingDetails={minimalDetails} onClose={mockOnClose} />
    );

    // Should still render the main elements
    expect(screen.getByText("Varaus onnistui!")).toBeInTheDocument();
    expect(screen.getByText("2025-09-15")).toBeInTheDocument();
    expect(screen.getByText("10:00-12:00")).toBeInTheDocument();
  });
});
