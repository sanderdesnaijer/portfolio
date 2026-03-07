import envConfig from "@/envConfig";
import { AUTHOR_NAME } from "./constants";
import {
  buildPageUrl,
  convertDate,
  generateTitle,
  toTagSlug,
  truncateText,
} from "./utils";

describe("app/utils/utils", () => {
  describe("convertDate", () => {
    it("should format the date with day, month, and year when shouldShowDay is true", () => {
      const date = "2025-01-27";
      const result = convertDate(date);
      expect(result).toBe("Jan 2025");
    });

    it("should handle invalid date strings gracefully", () => {
      const invalidDate = "invalid-date";
      expect(convertDate(invalidDate)).toEqual("Invalid Date");
    });

    it("should handle different locales correctly (using en-GB)", () => {
      const date = "2025-12-25";
      const result = convertDate(date);
      expect(result).toBe("Dec 2025");
    });
  });

  describe("truncateText", () => {
    it("should return the original text if it is shorter than or equal to the specified length", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
      expect(truncateText("Hello", 5)).toBe("Hello");
    });

    it('should truncate the text and append "..." if it exceeds the specified length', () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
      expect(truncateText("Hello World", 8)).toBe("Hello Wo...");
    });

    it("should truncate text longer than the specified length", () => {
      const longText = "This is a very long text that needs to be truncated.";
      const truncatedText = truncateText(longText, 20);
      expect(truncatedText).toBe("This is a very long ...");
    });

    it("should handle an empty string", () => {
      expect(truncateText("", 5)).toBe("");
    });

    it("should handle length of 0", () => {
      expect(truncateText("Hello", 0)).toBe("...");
    });

    it("should work with text shorter than 3 characters and very small lengths", () => {
      expect(truncateText("Hi", 1)).toBe("H...");
      expect(truncateText("A", 0)).toBe("...");
    });
  });

  describe("generateTitle", () => {
    it("should generate a title without project", () => {
      const result = generateTitle("My Portfolio");
      expect(result).toBe(`${AUTHOR_NAME} | My Portfolio`);
    });

    it("should generate a title with project", () => {
      const result = generateTitle("My Portfolio", "Project One");
      expect(result).toBe(`${AUTHOR_NAME} | My Portfolio | Project One`);
    });

    it("should handle undefined project", () => {
      const result = generateTitle("My Portfolio", undefined);
      expect(result).toBe(`${AUTHOR_NAME} | My Portfolio`);
    });

    it("should return only the author name if no title is provided", () => {
      const result = generateTitle();
      expect(result).toBe(AUTHOR_NAME);
    });
  });

  describe("buildPageUrl", () => {
    it("should return the correct URL for a page without a detail slug", () => {
      expect(buildPageUrl("home")).toBe(`${envConfig.baseUrl}/home`);
    });

    it("should return the correct URL for a page with a detail slug", () => {
      expect(buildPageUrl("products", "123")).toBe(
        `${envConfig.baseUrl}/products/123`
      );
    });

    it("should handle special characters in slugs", () => {
      expect(buildPageUrl("category", "t-shirts")).toBe(
        `${envConfig.baseUrl}/category/t-shirts`
      );
    });
  });

  describe("toTagSlug", () => {
    it("should convert labels to kebab-case", () => {
      expect(toTagSlug("NextJS")).toBe("nextjs");
      expect(toTagSlug("Flutter App")).toBe("flutter-app");
    });

    it("should remove accents and trim extra separators", () => {
      expect(toTagSlug("  Développeur  ")).toBe("developpeur");
      expect(toTagSlug("Firebase / Auth")).toBe("firebase-auth");
    });

    it("should return an empty string when no alphanumeric characters remain", () => {
      expect(toTagSlug("!!!")).toBe("");
      expect(toTagSlug("###")).toBe("");
    });
  });
});
