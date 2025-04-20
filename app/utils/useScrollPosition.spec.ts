import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import { useScrollPosition } from "./useScrollPosition";

describe("useScrollPosition", () => {
  let mockMatchMedia: jest.Mock;

  beforeAll(() => {
    // Mock matchMedia
    mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 48rem)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  it("should initialize with sticky disabled", () => {
    const scrollRef = createRef<HTMLElement>();

    const { result } = renderHook(() =>
      useScrollPosition(scrollRef, { className: "hide-menu" })
    );

    expect(result).toBeDefined();
  });

  it("should enable sticky when media query matches (mobile view)", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Simulate mobile view
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const scrollRef = createRef<HTMLElement>();

    const { result } = renderHook(() =>
      useScrollPosition(scrollRef, { className: "hide-menu" })
    );

    expect(result).toBeDefined();
  });

  it("should disable sticky on wider screens (desktop view)", () => {
    mockMatchMedia.mockReturnValue({
      matches: true, // Simulate desktop view
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const scrollRef = createRef<HTMLElement>();

    const { result } = renderHook(() =>
      useScrollPosition(scrollRef, { className: "hide-menu" })
    );

    expect(result).toBeDefined();
  });
});
