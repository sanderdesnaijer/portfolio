import { AUTHOR_NAME } from "./constants";
import { getBaseUrl } from "./routes";
import {
  buildPageUrl,
  convertDate,
  extractTextFromHTML,
  generateTitle,
  getImageURL,
  getSlug,
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

  describe("extractTextFromHTML", () => {
    it("should remove all HTML tags and return plain text", () => {
      const input = "<p>Hello <strong>world</strong>!</p>";
      const output = extractTextFromHTML(input);
      expect(output).toBe("Hello world !...");
    });

    it("should remove figcaptions from the text", () => {
      const input =
        "<figcaption>This is a caption</figcaption><p>Visible text</p>";
      const output = extractTextFromHTML(input);
      expect(output).toBe("Visible text...");
    });

    it("should collapse multiple spaces into a single space", () => {
      const input = "<p>Hello    world</p>";
      const output = extractTextFromHTML(input);
      expect(output).toBe("Hello world...");
    });

    it("should truncate text to 200 characters and add ellipsis", () => {
      const longText = "A".repeat(250);
      const input = `<p>${longText}</p>`;
      const output = extractTextFromHTML(input);
      expect(output.length).toBe(203); // 200 chars + "..."
      expect(output.endsWith("...")).toBeTruthy();
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

  describe("getImageURL", () => {
    it("should return the image URL when a valid <img> tag is provided", () => {
      const articleDescription =
        '<p>Some text <img src="https://example.com/image.jpg" alt="example image"></p>';
      const result = getImageURL(articleDescription);
      expect(result).toBe("https://example.com/image.jpg");
    });

    it("should return undefined when there is no <img> tag", () => {
      const articleDescription = "<p>Some text without an image tag</p>";
      const result = getImageURL(articleDescription);
      expect(result).toBeUndefined();
    });

    it("should return the first image URL when multiple <img> tags are present", () => {
      const articleDescription =
        '<p><img src="https://example.com/first.jpg"><img src="https://example.com/second.jpg"></p>';
      const result = getImageURL(articleDescription);
      expect(result).toBe("https://example.com/first.jpg");
    });
  });

  describe("getSlug", () => {
    it("should return the slug from a valid URL", () => {
      const url = "https://example.com/some-slug-123abc456def?param=value";
      const result = getSlug(url);
      expect(result).toBe("some-slug");
    });

    it('should return "not-found" when the URL does not match the expected pattern', () => {
      const url = "https://example.com/no-slug-here?param=value";
      const result = getSlug(url);
      expect(result).toBe("not-found");
    });

    it('should return "not-found" when the URL does not contain the unique identifier after the slug', () => {
      const url = "https://example.com/some-slug?param=value";
      const result = getSlug(url);
      expect(result).toBe("not-found");
    });

    it('should return "not-found" when the URL does not contain a query parameter after the identifier', () => {
      const url = "https://example.com/some-slug-123abc456def";
      const result = getSlug(url);
      expect(result).toBe("not-found");
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
  });

  describe("buildPageUrl", () => {
    it("should return the correct URL for a page without a detail slug", () => {
      expect(buildPageUrl("home")).toBe(`${getBaseUrl()}/home`);
    });

    it("should return the correct URL for a page with a detail slug", () => {
      expect(buildPageUrl("products", "123")).toBe(
        `${getBaseUrl()}/products/123`
      );
    });

    it("should handle special characters in slugs", () => {
      expect(buildPageUrl("category", "t-shirts")).toBe(
        `${getBaseUrl()}/category/t-shirts`
      );
    });
  });
});
