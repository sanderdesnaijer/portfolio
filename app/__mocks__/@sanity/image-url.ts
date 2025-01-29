import { jest } from "@jest/globals";

const mockedImageUrl = jest.fn(() => ({
  image: jest.fn(() => ({
    width: jest.fn(() => ({
      height: jest.fn(() => ({
        url: jest.fn(() => "http://mocked-image-url"),
      })),
    })),
  })),
}));

export default mockedImageUrl;
