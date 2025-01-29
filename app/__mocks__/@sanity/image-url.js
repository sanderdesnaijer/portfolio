// __mocks__/@sanity/image-url.js
module.exports = {
  __esModule: true,
  default: jest.fn(() => ({
    image: jest.fn(() => ({
      width: jest.fn(() => ({
        height: jest.fn(() => ({
          url: jest.fn(() => "http://mocked-image-url"),
        })),
      })),
    })),
  })),
};
