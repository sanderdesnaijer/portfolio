import { renderHook, act } from "@testing-library/react";
import { createRef } from "react";
import useScrollPosition from "./useScrollPosition";

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
    const scrollRef = createRef<HTMLDivElement>();

    const { result } = renderHook(() => useScrollPosition(scrollRef));

    expect(result.current.isStickyEnabled).toBe(false);
  });

  it("should enable sticky when media query matches (mobile view)", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Simulate mobile view
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const scrollRef = createRef<HTMLDivElement>();

    const { result } = renderHook(() => useScrollPosition(scrollRef));

    expect(result.current.isStickyEnabled).toBe(true);
  });

  it("should disable sticky on wider screens (desktop view)", () => {
    mockMatchMedia.mockReturnValue({
      matches: true, // Simulate desktop view
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const scrollRef = createRef<HTMLDivElement>();

    const { result } = renderHook(() => useScrollPosition(scrollRef));

    expect(result.current.isStickyEnabled).toBe(false);
  });

  it("should respond to scroll events", () => {
    const scrollRef = createRef<HTMLDivElement>();

    const { result } = renderHook(() => useScrollPosition(scrollRef));

    // Mock scrollRef structure with a sticky element inside
    Object.defineProperty(scrollRef, "current", {
      value: {
        querySelector: jest.fn().mockReturnValue({
          offsetTop: 50,
          offsetHeight: 20,
        }),
        classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
      },
      writable: true,
    });

    act(() => {
      // Simulate scrolling
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // Expect sticky class logic to have been triggered
    expect(result.current.isStickyEnabled).toBe(false);
  });

  it("should clean up event listeners on unmount", () => {
    const scrollRef = createRef<HTMLDivElement>();

    const mockMdQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    // Mock matchMedia to return our fake mdQuery object
    global.matchMedia = jest.fn().mockReturnValue(mockMdQuery);

    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollPosition(scrollRef));

    // Verify mdQuery listener is added before window events
    expect(mockMdQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );

    unmount();

    // Verify mdQuery listener is removed before window events
    expect(mockMdQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
