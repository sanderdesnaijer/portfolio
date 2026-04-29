import { buildBreadcrumbList } from "./breadcrumb";

const mockBaseURL = "https://mocked-url.com";

jest.mock("../../envConfig", () => ({
  baseUrl: "https://mocked-url.com",
}));

describe("utils/breadcrumb", () => {
  describe("buildBreadcrumbList", () => {
    it("should return a 3-level breadcrumb for a blog detail page", () => {
      const result = buildBreadcrumbList({
        type: "blog",
        slug: "my-article",
        title: "My Article",
      });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${mockBaseURL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "My Article",
          },
        ],
      });
    });

    it("should return a 3-level breadcrumb for a project detail page", () => {
      const result = buildBreadcrumbList({
        type: "project",
        slug: "my-project",
        title: "My Project",
      });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${mockBaseURL}/projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "My Project",
          },
        ],
      });
    });

    it("should return a 3-level breadcrumb for a tag detail page", () => {
      const result = buildBreadcrumbList({
        type: "tag",
        slug: "react",
        title: "React",
      });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tags",
            item: `${mockBaseURL}/tags`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "React",
          },
        ],
      });
    });

    it("should return a 2-level breadcrumb for a blog index page", () => {
      const result = buildBreadcrumbList({ type: "blog" });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
          },
        ],
      });
    });

    it("should return a 2-level breadcrumb for a projects index page", () => {
      const result = buildBreadcrumbList({ type: "project" });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
          },
        ],
      });
    });

    it("should return a 2-level breadcrumb for a tags index page", () => {
      const result = buildBreadcrumbList({ type: "tag" });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: mockBaseURL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tags",
          },
        ],
      });
    });

    it("should omit item URL on the last breadcrumb element", () => {
      const result = buildBreadcrumbList({
        type: "blog",
        slug: "test-post",
        title: "Test Post",
      });

      const lastItem =
        result.itemListElement[result.itemListElement.length - 1];
      expect(lastItem).not.toHaveProperty("item");
    });

    it("should include item URL on all non-last elements", () => {
      const result = buildBreadcrumbList({
        type: "blog",
        slug: "test-post",
        title: "Test Post",
      });

      // Home and Blog should both have item URLs
      expect(result.itemListElement[0]).toHaveProperty("item");
      expect(result.itemListElement[1]).toHaveProperty("item");
    });

    it("should build absolute URLs from baseUrl", () => {
      const result = buildBreadcrumbList({
        type: "project",
        slug: "my-app",
        title: "My App",
      });

      expect(result.itemListElement[0].item).toBe(mockBaseURL);
      expect(result.itemListElement[1].item).toBe(`${mockBaseURL}/projects`);
    });

    it("should use 'projects' as path prefix for project type", () => {
      const result = buildBreadcrumbList({
        type: "project",
        slug: "my-app",
        title: "My App",
      });

      // The second element should point to /projects
      expect(result.itemListElement[1].item).toContain("/projects");
    });

    it("should not add detail segment when only slug is provided without title", () => {
      const result = buildBreadcrumbList({
        type: "blog",
        slug: "orphan-slug",
      });

      // Should be 2 levels since title is missing
      expect(result.itemListElement).toHaveLength(2);
    });

    it("should not add detail segment when only title is provided without slug", () => {
      const result = buildBreadcrumbList({
        type: "blog",
        title: "Orphan Title",
      });

      // Should be 2 levels since slug is missing
      expect(result.itemListElement).toHaveLength(2);
    });
  });
});
