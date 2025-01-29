import "@testing-library/jest-dom";

jest.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));
