import "@testing-library/jest-dom";

import { mswServer } from "./app/mock/mswServer";

// Start the server before running tests
beforeAll(() => mswServer.listen());

// Reset any handlers that might be overridden during tests
afterEach(() => mswServer.resetHandlers());

// Close the mswServer after tests are done
afterAll(() => mswServer.close());

jest.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

// Mock SVG imports
jest.mock("*.svg", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  const SvgComponent = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
  >((props, ref) => {
    return React.createElement("svg", {
      ...props,
      ref,
      "data-testid": "mocked-svg",
    } as React.SVGProps<SVGSVGElement>);
  });
  SvgComponent.displayName = "SvgComponent";
  return SvgComponent;
});

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
