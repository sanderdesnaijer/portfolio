import { jest } from "@jest/globals";

const createMockedBuilder = () => ({
  image: jest.fn(() => ({
    width: jest.fn(() => ({
      height: jest.fn(() => ({
        url: jest.fn(() => "http://mocked-image-url"),
      })),
    })),
  })),
});

// Named export (new way)
export const createImageUrlBuilder = jest.fn(createMockedBuilder);

// Default export (deprecated, but kept for backwards compatibility)
const mockedImageUrl = jest.fn(createMockedBuilder);
export default mockedImageUrl;

// Type export
export type SanityImageSource = string | object;
