import {
  generateTitle,
  generateContentTitle,
  convertDate,
  truncateText,
  buildPageUrl,
  toTagSlug,
} from "./utils";
import { AUTHOR_NAME } from "./constants";

jest.mock("../../envConfig", () => ({
  baseUrl: "https://mocked-url.com",
}));

describe("utils/utils", () => {
  describe("generateTitle", () => {
    it("should return only the author name when no page title is provided", () => {
      expect(generateTitle()).toBe(AUTHOR_NAME);
    });

    it("should return brand-first title with page title", () => {
      expect(generateTitle("Blog")).toBe(`${AUTHOR_NAME} | Blog`);
    });

    it("should return brand-first title with page and sub-page title", () => {
      expect(generateTitle("Blog", "My Article")).toBe(
        `${AUTHOR_NAME} | Blog | My Article`
      );
    });
  });

  describe("generateContentTitle", () => {
    it("should return content-first title with brand suffix", () => {
      expect(generateContentTitle("My Article")).toBe(
        `My Article | ${AUTHOR_NAME}`
      );
    });

    it("should work for section names", () => {
      expect(generateContentTitle("Blog")).toBe(`Blog | ${AUTHOR_NAME}`);
    });

    it("should work for project names", () => {
      expect(generateContentTitle("Flutter Tabata Timer")).toBe(
        `Flutter Tabata Timer | ${AUTHOR_NAME}`
      );
    });
  });

  describe("convertDate", () => {
    it("should format a date without day by default", () => {
      const result = convertDate("2023-01-15T00:00:00.000Z");
      expect(result).toBe("Jan 2023");
    });

    it("should include the day when showDay is true", () => {
      const result = convertDate("2023-01-15T00:00:00.000Z", true);
      expect(result).toBe("15 Jan 2023");
    });
  });

  describe("truncateText", () => {
    it("should return the original text when shorter than the limit", () => {
      const text = "Short text";
      expect(truncateText(text, 20)).toBe(text);
    });

    it("should truncate and append ellipsis when longer than the limit", () => {
      const text = "This is a much longer piece of text.";
      const result = truncateText(text, 10);
      expect(result).toBe("This is a ...");
    });
  });

  describe("buildPageUrl", () => {
    it("should return the correct URL for a page without a detail slug", () => {
      expect(buildPageUrl("home")).toBe("https://mocked-url.com/home");
    });

    it("should return the correct URL for a page with a detail slug", () => {
      expect(buildPageUrl("products", "123")).toBe(
        "https://mocked-url.com/products/123"
      );
    });

    it("should handle special characters in slugs", () => {
      expect(buildPageUrl("category", "t-shirts")).toBe(
        "https://mocked-url.com/category/t-shirts"
      );
    });
  });

  describe("toTagSlug", () => {
    it("should normalize whitespace and casing", () => {
      expect(toTagSlug(" TypeScript Basics ")).toBe("typescript-basics");
    });

    it("should strip diacritics and punctuation", () => {
      expect(toTagSlug("Café Racer!")).toBe("cafe-racer");
    });
  });
});
