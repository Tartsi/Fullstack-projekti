import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Footer from "./Footer";
import Header from "./Header";
import { LanguageProvider } from "../i18n/LanguageContext";

describe("Footer Component", () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the contact us header", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(screen.getByText("Anna palautetta")).toBeInTheDocument();
  });

  it("renders the contact information header", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(screen.getByText("Yhteystiedot")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(
      screen.getByText("info@workday-siivouspalvelut.fi")
    ).toBeInTheDocument();
    expect(screen.getByText("+358 40 123 4567")).toBeInTheDocument();
    expect(
      screen.getByText("Siivoustie 123, 00100 Helsinki")
    ).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    expect(
      screen.getByText("Seuraa Meitä Sosiaalisessa Mediassa!")
    ).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("TikTok")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(5); // 5 social media links

    // Check if Font Awesome icons are present
    expect(document.querySelector(".fa-x-twitter")).toBeInTheDocument();
    expect(document.querySelector(".fa-linkedin")).toBeInTheDocument();
    expect(document.querySelector(".fa-github")).toBeInTheDocument();
    expect(document.querySelector(".fa-instagram")).toBeInTheDocument();
    expect(document.querySelector(".fa-tiktok")).toBeInTheDocument();
  });

  it("renders copyright information with current year", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const currentYear = new Date().getFullYear();
    const copyrightElements = screen.getAllByText(
      `© ${currentYear} Workday-Vacuumers. Kaikki oikeudet pidätetään.`
    );
    expect(copyrightElements).toHaveLength(2); // One for mobile, one for desktop
    copyrightElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it("social media links have hover effects", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const socialLinks = screen.getAllByRole("link");

    socialLinks.forEach((link) => {
      expect(link).toHaveClass(
        "hover:scale-110",
        "transition-transform",
        "duration-[625ms]"
      );
    });
  });

  it("has proper footer semantic structure", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("text-black", "py-8", "font-light");
  });

  // Contact Us Form Tests
  it("renders contact us form with textarea and submit button", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    expect(textarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("shows character counter", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    expect(screen.getByText("0/150")).toBeInTheDocument();
  });

  it("updates character counter when typing", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    await user.type(textarea, "Hello");

    expect(screen.getByText("5/150")).toBeInTheDocument();
  });

  it("prevents typing beyond 150 characters", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const longText = "a".repeat(160); // 160 characters

    await user.type(textarea, longText);

    expect(textarea.value).toHaveLength(150);
    expect(screen.getByText("150/150")).toBeInTheDocument();
  });

  it("submit button is disabled when textarea is empty", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const submitButton = screen.getByRole("button", { name: /lähetä/i });
    expect(submitButton).toBeDisabled();
  });

  it("submit button is enabled when textarea has content", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    await user.type(textarea, "Hello");

    expect(submitButton).toBeEnabled();
  });

  it("shows locked icon when button is disabled", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const lockIcon = screen.getByAltText("Locked");
    expect(lockIcon).toBeInTheDocument();
  });

  it("shows unlocked icon when button is enabled", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    await user.type(textarea, "Hello");

    const unlockIcon = screen.getByAltText("Unlocked");
    expect(unlockIcon).toBeInTheDocument();
  });

  it("shows loading state when submitting", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    await user.type(textarea, "Hello");
    await user.click(submitButton);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    await user.type(textarea, "Hello");
    await user.click(submitButton);

    // Wait for success message
    await waitFor(
      () => {
        expect(
          screen.getByText("Viesti lähetetty onnistuneesti!")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    const submitButton = screen.getByRole("button", { name: /lähetä/i });

    await user.type(textarea, "Hello");
    await user.click(submitButton);

    // Wait for form to clear
    await waitFor(
      () => {
        expect(textarea.value).toBe("");
        expect(screen.getByText("0/150")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("has correct form styling", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "Kirjoita viestisi tähän (max 150 merkkiä)"
    );
    expect(textarea).toHaveClass("bg-gray-100", "border-2", "border-black");
  });

  it("has responsive layout classes", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const footer = screen.getByRole("contentinfo");
    const mainContainer = footer.querySelector(".flex.flex-col.lg\\:flex-row");

    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("flex", "flex-col", "lg:flex-row");
  });

  it("changes language when language switch is toggled", async () => {
    render(
      <LanguageProvider>
        <Header />
        <Footer />
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

    // Check if language has changed
    expect(screen.getByText("Feedback")).toBeInTheDocument();
  });
});
