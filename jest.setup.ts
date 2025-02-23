import "@testing-library/jest-dom";

jest.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

// check if window is defined for node env tests
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
