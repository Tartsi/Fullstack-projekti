import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReviewCard from "./ReviewCard";

const mockReview = {
  id: 1,
  name: "Testi Testinen",
  age: 35,
  rating: 4,
  comment: "Hyvä palvelu, suosittelen!",
  img: "/placeholders/test.webp",
};

describe("ReviewCard Component", () => {
  it("renders review card with all required elements", () => {
    render(<ReviewCard review={mockReview} />);

    // Check for reviewer name
    expect(screen.getByText("Testi Testinen")).toBeInTheDocument();

    // Check for age
    expect(screen.getByText("35 vuotta")).toBeInTheDocument();

    // Check for comment
    expect(
      screen.getByText('"Hyvä palvelu, suosittelen!"')
    ).toBeInTheDocument();
  });

  it("generates avatar with correct initial when image fails", () => {
    render(<ReviewCard review={mockReview} />);

    // Check for avatar with initial "T"
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("applies correct position styles for center position", () => {
    render(<ReviewCard review={mockReview} position="center" />);

    // Check that the component renders with center positioning
    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("translate-x-0", "scale-100", "opacity-100");
  });

  it("applies correct position styles for left position", () => {
    render(<ReviewCard review={mockReview} position="left" />);

    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("-translate-x-[80%]", "scale-80", "opacity-40");
  });

  it("applies correct position styles for right position", () => {
    render(<ReviewCard review={mockReview} position="right" />);

    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("translate-x-[80%]", "scale-80", "opacity-40");
  });

  it("applies visibility styles correctly", () => {
    const { rerender } = render(
      <ReviewCard review={mockReview} isVisible={true} />
    );

    let card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).not.toHaveClass("opacity-0", "scale-80");

    rerender(<ReviewCard review={mockReview} isVisible={false} />);
    card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("opacity-0", "scale-80");
  });

  it("has proper responsive classes", () => {
    render(<ReviewCard review={mockReview} />);

    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("w-80", "h-80", "md:w-96", "md:h-96");
  });

  it("renders with proper shadow and styling", () => {
    render(<ReviewCard review={mockReview} />);

    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("bg-white", "rounded-full", "shadow-lg");
  });

  it("uses Arial font family", () => {
    render(<ReviewCard review={mockReview} />);

    const card = screen
      .getByText('"Hyvä palvelu, suosittelen!"')
      .closest('[class*="bg-white"]');
    expect(card).toHaveClass("font-['Arial',sans-serif]");
  });

  it("adjusts text size based on comment length", () => {
    const shortComment = { ...mockReview, comment: "Short" };
    const mediumComment = {
      ...mockReview,
      comment:
        "This is a medium length comment that should trigger base text size.",
    };
    const longComment = {
      ...mockReview,
      comment:
        "This is a very long comment that should definitely trigger the small text size because it exceeds 80 characters in total length.",
    };

    const { rerender } = render(<ReviewCard review={shortComment} />);
    let commentElement = screen.getByText('"Short"');
    expect(commentElement).toHaveClass("text-lg");

    rerender(<ReviewCard review={mediumComment} />);
    commentElement = screen.getByText(/medium length comment/);
    expect(commentElement).toHaveClass("text-base");

    rerender(<ReviewCard review={longComment} />);
    commentElement = screen.getByText(/very long comment/);
    expect(commentElement).toHaveClass("text-sm");
  });

  describe("Navigation arrows", () => {
    it("does not show navigation arrows by default", () => {
      render(<ReviewCard review={mockReview} position="center" />);

      expect(
        screen.queryByLabelText("Previous review")
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next review")).not.toBeInTheDocument();
    });

    it("shows navigation arrows when showNavigation is true and position is center", () => {
      const mockPrev = vi.fn();
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onPrevious={mockPrev}
          onNext={mockNext}
        />
      );

      expect(screen.getByLabelText("Previous review")).toBeInTheDocument();
      expect(screen.getByLabelText("Next review")).toBeInTheDocument();
    });

    it("does not show navigation arrows when position is not center", () => {
      const mockPrev = vi.fn();
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="left"
          showNavigation={true}
          onPrevious={mockPrev}
          onNext={mockNext}
        />
      );

      expect(
        screen.queryByLabelText("Previous review")
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next review")).not.toBeInTheDocument();
    });

    it("calls onPrevious when previous arrow is clicked", () => {
      const mockPrev = vi.fn();
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onPrevious={mockPrev}
          onNext={mockNext}
        />
      );

      fireEvent.click(screen.getByLabelText("Previous review"));
      expect(mockPrev).toHaveBeenCalledTimes(1);
    });

    it("calls onNext when next arrow is clicked", () => {
      const mockPrev = vi.fn();
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onPrevious={mockPrev}
          onNext={mockNext}
        />
      );

      fireEvent.click(screen.getByLabelText("Next review"));
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("disables navigation arrows when isAnimating is true", () => {
      const mockPrev = vi.fn();
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onPrevious={mockPrev}
          onNext={mockNext}
          isAnimating={true}
        />
      );

      const prevButton = screen.getByLabelText("Previous review");
      const nextButton = screen.getByLabelText("Next review");

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("only shows previous arrow when onNext is not provided", () => {
      const mockPrev = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onPrevious={mockPrev}
        />
      );

      expect(screen.getByLabelText("Previous review")).toBeInTheDocument();
      expect(screen.queryByLabelText("Next review")).not.toBeInTheDocument();
    });

    it("only shows next arrow when onPrevious is not provided", () => {
      const mockNext = vi.fn();

      render(
        <ReviewCard
          review={mockReview}
          position="center"
          showNavigation={true}
          onNext={mockNext}
        />
      );

      expect(
        screen.queryByLabelText("Previous review")
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Next review")).toBeInTheDocument();
    });
  });
});
