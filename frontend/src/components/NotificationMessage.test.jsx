import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotificationMessage from "./NotificationMessage";
import { LanguageProvider } from "../i18n/LanguageContext";

// Mock icons
vi.mock("../assets/icons/user-check-svgrepo-com.svg", () => ({
  default: "mocked-user-check-icon.svg",
}));

vi.mock("../assets/icons/verified-svgrepo-com.svg", () => ({
  default: "mocked-verified-icon.svg",
}));

vi.mock("../assets/icons/cross-svgrepo-com.svg", () => ({
  default: "mocked-cross-icon.svg",
}));

vi.mock(
  "../assets/icons/email-envelope-letter-message-check-confirm-svgrepo-com.svg",
  () => ({
    default: "mocked-email-icon.svg",
  })
);

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Helper function to render component with language provider
const renderWithProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("NotificationMessage", () => {
  it("renders successfully notification with message", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Test success message"
        type="success"
      />
    );

    expect(screen.getByText("Test success message")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={false}
        message="Test message"
        type="success"
      />
    );

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("renders error notification with correct styling", () => {
    const { container } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Test error message"
        type="error"
      />
    );

    expect(screen.getByText("Test error message")).toBeInTheDocument();

    const notification = container.querySelector(".bg-red-500");
    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass("text-white");
  });

  it("renders success notification with correct styling", () => {
    const { container } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Test success message"
        type="success"
      />
    );

    const notification = container.querySelector(".bg-green-500");
    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass("text-white");
  });

  it("displays correct icon for login context", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Login success"
        type="success"
        context="login"
      />
    );

    const icon = screen.getByAltText("Onnistui");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "mocked-user-check-icon.svg");
  });

  it("displays correct icon for register context", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Register success"
        type="success"
        context="register"
      />
    );

    const icon = screen.getByAltText("Onnistui");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "mocked-verified-icon.svg");
  });

  it("displays correct icon for forgot password context", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Password reset email sent"
        type="success"
        context="forgot"
      />
    );

    const icon = screen.getByAltText("Onnistui");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "mocked-email-icon.svg");
  });

  it("displays error icon for error type", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Error occurred"
        type="error"
      />
    );

    const icon = screen.getByAltText("Virhe");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "mocked-cross-icon.svg");
  });

  it("displays notification with animation", () => {
    const { container } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Animated message"
        type="success"
      />
    );

    const notification = container.querySelector(".bg-green-500");
    expect(notification).toBeInTheDocument();
  });

  it("supports custom context", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Custom context message"
        type="success"
        context="custom"
      />
    );

    expect(screen.getByText("Custom context message")).toBeInTheDocument();
  });

  it("handles missing context gracefully", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="No context provided"
        type="success"
      />
    );

    expect(screen.getByText("No context provided")).toBeInTheDocument();
  });

  it("renders with proper accessibility attributes", () => {
    const { container } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Accessible notification"
        type="success"
      />
    );

    const notification = container.querySelector(".bg-green-500");
    expect(notification).toBeInTheDocument();
    expect(screen.getByText("Accessible notification")).toBeInTheDocument();
  });

  it("handles long messages gracefully", () => {
    const longMessage =
      "This is a very long notification message that should be handled properly by the component without breaking the layout or causing any visual issues in the user interface.";

    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message={longMessage}
        type="success"
      />
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it("supports different notification types", () => {
    const { rerender } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Success message"
        type="success"
      />
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <NotificationMessage
          isVisible={true}
          message="Error message"
          type="error"
        />
      </LanguageProvider>
    );

    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("defaults to login context when context is not provided", () => {
    renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Default context test"
        type="success"
      />
    );

    const icon = screen.getByAltText("Onnistui");
    expect(icon).toHaveAttribute("src", "mocked-user-check-icon.svg");
  });

  it("handles context changes correctly", () => {
    const { rerender } = renderWithProvider(
      <NotificationMessage
        isVisible={true}
        message="Register success"
        type="success"
        context="register"
      />
    );

    let icon = screen.getByAltText("Onnistui");
    expect(icon).toHaveAttribute("src", "mocked-verified-icon.svg");

    rerender(
      <LanguageProvider>
        <NotificationMessage
          isVisible={true}
          message="Login success"
          type="success"
          context="login"
        />
      </LanguageProvider>
    );

    icon = screen.getByAltText("Onnistui");
    expect(icon).toHaveAttribute("src", "mocked-user-check-icon.svg");
  });
});
