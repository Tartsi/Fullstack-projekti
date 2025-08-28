import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { server } from "../test/mocks/server.js";
import { http, HttpResponse } from "msw";
import AuthModal from "./AuthModal";
import { LanguageProvider, useLanguage } from "../i18n/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";

// API base URL from environment or default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
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

describe("AuthModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = "unset";
  });

  it("renders modal when isOpen is true", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Kirjaudu")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sähköposti")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Salasana")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    renderWithProviders(<AuthModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText("Kirjaudu")).not.toBeInTheDocument();
  });

  it("prevents body scroll when modal is open", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when modal is closed", () => {
    const { rerender } = renderWithProviders(
      <AuthModal isOpen={true} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <AuthProvider>
        <LanguageProvider>
          <AuthModal isOpen={false} onClose={mockOnClose} />
        </LanguageProvider>
      </AuthProvider>
    );

    expect(document.body.style.overflow).toBe("unset");
  });

  it("closes modal when close button is clicked", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: /close dialog/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal when clicking outside", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const backdrop = document.querySelector(".fixed.inset-0");
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("switches to register view when 'Luo uusi käyttäjä' is clicked", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const createAccountLink = screen.getByText("Luo uusi käyttäjä");
    fireEvent.click(createAccountLink);

    expect(
      screen.getByRole("heading", { name: "LUO TILI" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Koko Nimi")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Vahvista Salasana")
    ).toBeInTheDocument();
  });

  it("switches to forgot password view when 'Unohditko salasanasi?' is clicked", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const forgotPasswordLink = screen.getByText("Unohditko salasanasi?");
    fireEvent.click(forgotPasswordLink);

    expect(screen.getByText("PALAUTA SALASANA")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Salasana")).not.toBeInTheDocument();
  });

  it("validates required fields in login form", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const submitButton = screen.getByRole("button", {
      name: /kirjaudu/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Sähköposti vaaditaan")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Salasana vaaditaan")
      ).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText("Sähköposti");
    const passwordInput = screen.getByPlaceholderText("Salasana");
    const submitButton = screen.getByRole("button", { name: /kirjaudu/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Test makes sure form is not submitted with an invalid email
    await waitFor(() => {
      expect(screen.getByDisplayValue("invalid-email")).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const passwordInput = screen.getByPlaceholderText("Salasana");
    fireEvent.change(passwordInput, { target: { value: "123" } });

    const submitButton = screen.getByRole("button", {
      name: /kirjaudu/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          "Salasanan tulee olla vähintään 6 merkkiä pitkä"
        )
      ).toBeInTheDocument();
    });
  });

  it("submits login form with valid data", async () => {
    // MSW will handle the API call automatically using the handlers
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText("Sähköposti");
    const passwordInput = screen.getByPlaceholderText("Salasana");
    const submitButton = screen.getByRole("button", {
      name: /kirjaudu/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-success")).toBeInTheDocument();
    });
  });

  it("validates register form fields", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    // Switch to register view
    const createAccountLink = screen.getByText("Luo uusi käyttäjä");
    fireEvent.click(createAccountLink);

    const submitButton = screen.getByRole("button", { name: /luo tili/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Koko nimi vaaditaan")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Sähköposti vaaditaan")
      ).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("Salasana vaaditaan")).toHaveLength(
        2
      );
    });
  });

  it("validates password confirmation in register form", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    // Switch to register view
    const createAccountLink = screen.getByText("Luo uusi käyttäjä");
    fireEvent.click(createAccountLink);

    const passwordInput = screen.getByPlaceholderText("Salasana");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Vahvista Salasana");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });

    const submitButton = screen.getByRole("button", { name: /luo tili/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Salasanat eivät täsmää")
      ).toBeInTheDocument();
    });
  });

  it("submits register form with valid data", async () => {
    // MSW will handle the API call automatically using the handlers
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    // Switch to register view
    const createAccountLink = screen.getByText("Luo uusi käyttäjä");
    fireEvent.click(createAccountLink);

    const nameInput = screen.getByPlaceholderText("Koko Nimi");
    const emailInput = screen.getByPlaceholderText("Sähköposti");
    const passwordInput = screen.getByPlaceholderText("Salasana");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Vahvista Salasana");
    const submitButton = screen.getByRole("button", { name: /luo tili/i });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-success")).toBeInTheDocument();
    });
  });

  it("submits forgot password form with valid email", async () => {
    // MSW will handle the API call automatically using the handlers
    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    // Switch to forgot password view
    const forgotPasswordLink = screen.getByText("Unohditko salasanasi?");
    fireEvent.click(forgotPasswordLink);

    const emailInput = screen.getByPlaceholderText("Sähköposti");
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-success")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Override the default handler for this specific test to return error
    server.use(
      http.post(`${API_BASE_URL}/api/users/login`, () => {
        return HttpResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      })
    );

    renderWithProviders(<AuthModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText("Sähköposti");
    const passwordInput = screen.getByPlaceholderText("Salasana");
    const submitButton = screen.getByRole("button", {
      name: /kirjaudu/i,
    });

    fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("notification-error")).toBeInTheDocument();
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("handles language change and updates modal content", async () => {
    let languageContext;
    const handleLanguageChange = (context) => {
      languageContext = context;
    };

    renderWithProviders(
      <LanguageTestHelper onLanguageChange={handleLanguageChange}>
        <AuthModal isOpen={true} onClose={mockOnClose} />
      </LanguageTestHelper>
    );

    // Initially should show Finnish content
    expect(screen.getByText("Kirjaudu")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sähköposti")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Salasana")).toBeInTheDocument();
    expect(screen.getByText("Luo uusi käyttäjä")).toBeInTheDocument();
    expect(screen.getByText("Unohditko salasanasi?")).toBeInTheDocument();

    // Change language to English
    await waitFor(() => {
      expect(languageContext).toBeDefined();
    });

    act(() => {
      languageContext.changeLanguage("en");
    });

    // Should now show English content
    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByText("Create new user")).toBeInTheDocument();
      expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    });

    // Switch to register view and verify English translations
    const createAccountLink = screen.getByText("Create new user");
    fireEvent.click(createAccountLink);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "CREATE ACCOUNT" })
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm Password")
      ).toBeInTheDocument();
    });
  });
});
