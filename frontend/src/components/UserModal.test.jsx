import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { server } from "../test/mocks/server.js";
import { http, HttpResponse } from "msw";
import UserModal from "./UserModal";
import { LanguageProvider, useLanguage } from "../i18n/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, ...props }) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    form: ({ children, onClick, ...props }) => (
      <form onClick={onClick} {...props}>
        {children}
      </form>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock NotificationMessage component
vi.mock("./NotificationMessage", () => ({
  default: ({ isVisible, message, type }) =>
    isVisible ? (
      <div data-testid={`notification-${type}`}>{message}</div>
    ) : null,
}));

// Helper function to render component with all necessary providers
const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </AuthProvider>
  );
};

// Test component that provides access to language context
const LanguageTestHelper = ({ children, onLanguageChange }) => {
  const { language, changeLanguage } = useLanguage();

  React.useEffect(() => {
    if (onLanguageChange) {
      onLanguageChange({ language, changeLanguage });
    }
  }, [language, changeLanguage, onLanguageChange]);

  return children;
};

describe("UserModal", () => {
  const mockOnClose = vi.fn();
  let timeouts = [];
  let intervals = [];

  // Override setTimeout and setInterval to track them
  const originalSetTimeout = global.setTimeout;
  const originalSetInterval = global.setInterval;
  const originalClearTimeout = global.clearTimeout;
  const originalClearInterval = global.clearInterval;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "unset";

    // Track timeouts and intervals
    timeouts = [];
    intervals = [];

    global.setTimeout = (fn, delay) => {
      const id = originalSetTimeout(fn, delay);
      timeouts.push(id);
      return id;
    };

    global.setInterval = (fn, delay) => {
      const id = originalSetInterval(fn, delay);
      intervals.push(id);
      return id;
    };

    global.clearTimeout = (id) => {
      const index = timeouts.indexOf(id);
      if (index > -1) timeouts.splice(index, 1);
      return originalClearTimeout(id);
    };

    global.clearInterval = (id) => {
      const index = intervals.indexOf(id);
      if (index > -1) intervals.splice(index, 1);
      return originalClearInterval(id);
    };

    // MSW will handle API responses automatically
  });

  afterEach(() => {
    // Clear all remaining timeouts and intervals
    timeouts.forEach((id) => originalClearTimeout(id));
    intervals.forEach((id) => originalClearInterval(id));

    // Restore original functions
    global.setTimeout = originalSetTimeout;
    global.setInterval = originalSetInterval;
    global.clearTimeout = originalClearTimeout;
    global.clearInterval = originalClearInterval;

    // Reset body overflow
    document.body.style.overflow = "unset";
  });

  it("renders modal when isOpen is true and user is logged in and language is Finnish by default", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("KÄYTTÄJÄSI")).toBeInTheDocument();
    });
  });

  it("does not render modal when isOpen is false", () => {
    renderWithProviders(<UserModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText("KÄYTTÄJÄSI")).not.toBeInTheDocument();
  });

  it("prevents body scroll when modal is open", () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("handles language change and updates modal content", async () => {
    let languageContext;
    const handleLanguageChange = (context) => {
      languageContext = context;
    };

    renderWithProviders(
      <LanguageTestHelper onLanguageChange={handleLanguageChange}>
        <UserModal isOpen={true} onClose={mockOnClose} />
      </LanguageTestHelper>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("KÄYTTÄJÄSI")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    expect(screen.getByText("PERUSTIEDOT")).toBeInTheDocument();
    expect(screen.getByText("KOKO NIMI")).toBeInTheDocument();
    expect(screen.getByText("SÄHKÖPOSTI")).toBeInTheDocument();
    expect(screen.getByText("VARAUKSENI")).toBeInTheDocument();
    expect(screen.getByText("POISTA TILI")).toBeInTheDocument();

    // Change language to English
    await waitFor(() => {
      expect(languageContext).toBeDefined();
    });

    act(() => {
      languageContext.changeLanguage("en");
    });

    // Should now show English content
    await waitFor(() => {
      expect(screen.getByText("YOUR PROFILE")).toBeInTheDocument();
      expect(screen.getByText("BASIC INFO")).toBeInTheDocument();
      expect(screen.getByText("FULL NAME")).toBeInTheDocument();
      expect(screen.getByText("EMAIL")).toBeInTheDocument();
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
      expect(screen.getByText("DELETE ACCOUNT")).toBeInTheDocument();
    });

    // Test delete confirmation dialog language change
    const deleteButton = screen.getByText("DELETE ACCOUNT");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("CONFIRM ACCOUNT DELETION")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    });
  });

  it("restores body scroll when modal is closed", () => {
    const { rerender } = renderWithProviders(
      <UserModal isOpen={true} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <AuthProvider>
        <LanguageProvider>
          <UserModal isOpen={false} onClose={mockOnClose} />
        </LanguageProvider>
      </AuthProvider>
    );

    expect(document.body.style.overflow).toBe("unset");
  });

  it("closes modal when close button is clicked", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("closes modal when clicking outside", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    // Click on the backdrop (the outer container div)
    const backdrop = document.querySelector(".fixed.inset-0.backdrop-blur-xs");
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("displays user details when loaded", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  it("displays user bookings when loaded", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      // Check if bookings section exists
      expect(screen.getByText("VARAUKSENI")).toBeInTheDocument();
    });

    // Check for bookings being displayed
    await waitFor(
      () => {
        // Look for booking location text (use getAllByText since there are multiple bookings)
        const locationTexts = screen.getAllByText(/Varauksen sijainti:/);
        expect(locationTexts).toHaveLength(2); // We expect 2 bookings
        // Look for confirmed status
        expect(screen.getAllByText("Vahvistettu")).toHaveLength(2);
        // Look for specific booking locations - use regex to handle multi-line text
        expect(screen.getByText(/Testikatu 1, Helsinki/)).toBeInTheDocument();
        expect(screen.getByText(/Esimerkkitie 5, Espoo/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows loading state initially", () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Ladataan käyttäjätietoja...")).toBeInTheDocument();
  });

  it("shows delete account confirmation dialog", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("VAHVISTA TILIN POISTO")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Salasana")).toBeInTheDocument();
    });
  });

  it("cancels delete account operation", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("VAHVISTA TILIN POISTO")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Peruuta");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("VAHVISTA TILIN POISTO")
      ).not.toBeInTheDocument();
    });
  });

  it("handles successful account deletion", async () => {
    // MSW will handle the deletion request automatically with success response
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("VAHVISTA TILIN POISTO")).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText("Salasana");
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });

    const confirmDeleteButton = screen.getByText("Vahvista Poisto");
    fireEvent.click(confirmDeleteButton);

    // Wait for success notification
    await waitFor(() => {
      expect(screen.getByTestId("notification-success")).toBeInTheDocument();
    });
  });

  it("handles delete account error", async () => {
    // Override MSW handler to return error for wrong password
    server.use(
      http.delete(`${API_BASE_URL}/api/users/delete`, async ({ request }) => {
        const data = await request.json();
        return HttpResponse.json(
          { ok: false, message: "Invalid password" },
          { status: 403 }
        );
      })
    );

    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    const passwordInput = screen.getByPlaceholderText("Salasana");
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    const confirmDeleteButton = screen.getByText("Vahvista Poisto");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-error")).toBeInTheDocument();
      expect(screen.getByText("Invalid password")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Override MSW handler to simulate network error
    server.use(
      http.get(`${API_BASE_URL}/api/users/info`, () => {
        return HttpResponse.json(
          { ok: false, message: "Network error" },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    // Modal should still render even with API errors
    expect(screen.getByText("KÄYTTÄJÄSI")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Ladataan käyttäjätietoja...")
      ).toBeInTheDocument();
    });
  });

  it("displays empty bookings state", async () => {
    // Override MSW handler to return empty bookings
    server.use(
      http.get(`${API_BASE_URL}/api/bookings`, () => {
        return HttpResponse.json([]);
      })
    );

    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(
        screen.getByText("Sinulla ei ole aktiivisia varauksia.")
      ).toBeInTheDocument();
    });
  });

  it("formats date correctly", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("1. helmikuuta 2024")).toBeInTheDocument();
    });
  });

  it("shows delete account button", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("POISTA TILI")).toBeInTheDocument();
    });
  });

  it("shows delete confirmation modal", async () => {
    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("VAHVISTA TILIN POISTO")).toBeInTheDocument();
    });
  });

  it("disables delete button while deleting", async () => {
    // Override MSW handler to add delay
    server.use(
      http.delete(`${API_BASE_URL}/api/users/delete`, async () => {
        // Add delay to simulate slow response
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({
          ok: true,
          message: "User deleted successfully",
        });
      })
    );

    renderWithProviders(<UserModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("POISTA TILI");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("VAHVISTA TILIN POISTO")).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText("Salasana");
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });

    const confirmDeleteButton = screen.getByText("Vahvista Poisto");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(screen.getByText("Poistetaan...")).toBeInTheDocument();
    });
  });
});
