import { BlogSanity } from "@/sanity/types/blogType";
import { extractTextFromHTML, getExcerpt } from "./blogUtils";

const makeBlog = (overrides: Partial<BlogSanity> = {}): BlogSanity =>
  ({
    _id: "test-id",
    _type: "blogPost",
    _rev: "rev",
    _createdAt: "2025-01-01",
    _updatedAt: "2025-01-01",
    title: "Test Post",
    publishedAt: "2025-01-01",
    slug: { current: "test-post" },
    author: "Test Author",
    ...overrides,
  }) as BlogSanity;

describe("app/utils/blogUtils", () => {
  describe("extractTextFromHTML", () => {
    it("should strip HTML tags and return plain text", () => {
      const html = "<p>Hello <strong>world</strong></p>";
      expect(extractTextFromHTML(html)).toBe("Hello world");
    });

    it("should strip figcaptions", () => {
      const html =
        "<figure><img src='x.jpg'/><figcaption>Caption text</figcaption></figure><p>Content</p>";
      expect(extractTextFromHTML(html)).toBe("Content");
    });

    it("should truncate long text to 200 characters with ellipsis", () => {
      const longContent = "<p>" + "a".repeat(250) + "</p>";
      const result = extractTextFromHTML(longContent);
      expect(result.length).toBe(203);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should not add ellipsis for short text", () => {
      const html = "<p>Short text</p>";
      const result = extractTextFromHTML(html);
      expect(result).toBe("Short text");
      expect(result.endsWith("...")).toBe(false);
    });

    it("should collapse whitespace", () => {
      const html = "<p>Hello    \n\n   world</p>";
      expect(extractTextFromHTML(html)).toBe("Hello world");
    });
  });

  describe("getExcerpt", () => {
    it("should return excerpt when available", () => {
      const blog = makeBlog({ excerpt: "My excerpt" });
      expect(getExcerpt(blog)).toBe("My excerpt");
    });

    it("should derive excerpt from body when no explicit excerpt exists", () => {
      const blog = makeBlog({
        body: [
          {
            _type: "block",
            _key: "k1",
            children: [{ _type: "span", text: "Body content here", marks: [] }],
            style: "normal",
          },
        ],
      });
      expect(getExcerpt(blog)).toBe("Body content here");
    });

    it("should fall back to legacy HTML description", () => {
      const blog = makeBlog({
        description: "<p>Legacy HTML content</p>",
      });
      expect(getExcerpt(blog)).toBe("Legacy HTML content");
    });

    it("should return empty string when no content exists", () => {
      const blog = makeBlog();
      expect(getExcerpt(blog)).toBe("");
    });

    it("should prefer excerpt over body", () => {
      const blog = makeBlog({
        excerpt: "Preferred excerpt",
        body: [
          {
            _type: "block",
            _key: "k1",
            children: [{ _type: "span", text: "Body text", marks: [] }],
            style: "normal",
          },
        ],
      });
      expect(getExcerpt(blog)).toBe("Preferred excerpt");
    });

    it("should prefer body over legacy description", () => {
      const blog = makeBlog({
        body: [
          {
            _type: "block",
            _key: "k1",
            children: [{ _type: "span", text: "Body text", marks: [] }],
            style: "normal",
          },
        ],
        description: "<p>Legacy</p>",
      });
      expect(getExcerpt(blog)).toBe("Body text");
    });

    it("should skip empty body arrays and fall back to description", () => {
      const blog = makeBlog({
        body: [],
        description: "<p>Fallback</p>",
      });
      expect(getExcerpt(blog)).toBe("Fallback");
    });
  });
});
