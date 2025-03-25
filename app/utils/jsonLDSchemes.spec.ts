import { AUTHOR_NAME } from "./constants";
import {
  getWebsiteScheme,
  getAboutScheme,
  getProjectsScheme,
} from "./jsonLDSchemes";

describe("utils/jsonLDSchemes", () => {
  describe("getWebsiteScheme", () => {
    it("should return a valid schema with required fields", () => {
      const input = {
        url: "https://example.com",
        title: "Example Site",
        description: "This is an example site.",
        imageUrl: "https://example.com/image.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      const result = getWebsiteScheme(input);

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: input.url,
        name: input.title,
        description: input.description,
        creator: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        image: input.imageUrl,
        dateCreated: input.createdAt,
        dateModified: input.updatedAt,
        inLanguage: "en-US",
      });
    });

    it("should override the default author when provided", () => {
      const input = {
        url: "https://example.com",
        title: "Example Site",
        description: "This is an example site.",
        author: "John Doe",
        imageUrl: "https://example.com/image.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      const result = getWebsiteScheme(input);
      expect(result.creator.name).toBe("John Doe");
    });

    it("should include the authorLink when provided", () => {
      const input = {
        url: "https://example.com",
        title: "Example Site",
        description: "This is an example site.",
        author: "John Doe",
        authorLink: "https://johndoe.com",
        imageUrl: "https://example.com/image.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      };

      const result = getWebsiteScheme(input);
      expect(result.creator.url).toBe("https://johndoe.com");
    });

    it("should use the provided language instead of default", () => {
      const input = {
        url: "https://example.com",
        title: "Example Site",
        description: "This is an example site.",
        imageUrl: "https://example.com/image.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
        language: "fr-FR",
      };

      const result = getWebsiteScheme(input);
      expect(result.inLanguage).toBe("fr-FR");
    });
  });
  describe("getAboutScheme", () => {
    it("should return a valid schema with required fields", () => {
      const input = {
        url: "https://example.com",
        links: ["https://github.com/user", "https://linkedin.com/in/user"],
        jobTitle: "Software Engineer",
        jobs: ["Company A", "Company B"],
        imageUrl: "https://example.com/profile.jpg",
      };

      const result = getAboutScheme(input);

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Person",
        name: AUTHOR_NAME,
        url: input.url,
        sameAs: input.links,
        jobTitle: input.jobTitle,
        worksFor: [
          { "@type": "Organization", name: "Company A" },
          { "@type": "Organization", name: "Company B" },
        ],
        image: input.imageUrl,
      });
    });

    it("should handle an empty jobs array", () => {
      const input = {
        url: "https://example.com",
        links: ["https://github.com/user"],
        jobTitle: "Software Engineer",
        jobs: [],
        imageUrl: "https://example.com/profile.jpg",
      };

      const result = getAboutScheme(input);
      expect(result.worksFor).toEqual([]);
    });
  });
  describe("getProjectsScheme", () => {
    it("should return a valid schema for a collection page", () => {
      const input = {
        title: "Projects",
        url: "http://test/projects",
        description: "A selection of projects I have worked on",
        projects: [
          {
            title: "Flutter Tabata whip timer",
            url: "http://test/projects/flutter-tabata-whip-timer",
            imageUrl:
              "https://cdn.test.io/images/c6ybobx3/production/1xs367222ba8434fdb83e7481e83391bf604795-2200x1160.png",
            description:
              "Building my first Flutter app has been an exciting journey, filled with challenges, discoveries, and valuable learning moments. I've documented my experience in a blog and you can download the app from the store, see the links below.",
            type: ["SoftwareApplication", "Product"],
            applicationCategory: "MobileApplication",
            operatingSystem: "iOS",
          },
        ],
      };

      const result = getProjectsScheme(input);

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Projects",
        url: "http://test/projects",
        description: "A selection of projects I have worked on",
        hasPart: [
          {
            "@type": ["SoftwareApplication", "Product"],
            "@id": "http://test/projects/flutter-tabata-whip-timer",
            name: "Flutter Tabata whip timer",
            url: "http://test/projects/flutter-tabata-whip-timer",
            image:
              "https://cdn.test.io/images/c6ybobx3/production/1xs367222ba8434fdb83e7481e83391bf604795-2200x1160.png",
            description:
              "Building my first Flutter app has been an exciting journey, filled with challenges, discoveries, and valuable learning moments. I've documented my experience in a blog and you can download the app from the store, see the links below.",
            applicationCategory: "MobileApplication",
            operatingSystem: "iOS",
          },
        ],
      });
    });

    it("should handle a project with multiple types correctly", () => {
      const input = {
        title: "Test Project",
        url: "http://example.com/test",
        description: "Testing project schema",
        projects: [
          {
            title: "Multi-Type Project",
            url: "http://example.com/project",
            imageUrl: "http://example.com/image.jpg",
            description: "A project with multiple types",
            type: ["SoftwareSourceCode", "WebApplication"],
            applicationCategory: "WebApp",
            codeRepository: "http://github.com/example",
            programmingLanguage: "JavaScript",
          },
        ],
      };

      const result = getProjectsScheme(input);

      expect(result.hasPart[0]["@type"]).toEqual([
        "SoftwareSourceCode",
        "WebApplication",
      ]);
      expect(result.hasPart[0].applicationCategory).toEqual("WebApp");
    });

    it("should handle missing optional fields", () => {
      const input = {
        title: "Minimal Project",
        url: "http://example.com/minimal",
        description: "Minimal schema test",
        projects: [
          {
            title: "Simple Project",
            url: "http://example.com/simple",
            imageUrl: "http://example.com/image.jpg",
            description: "A simple project with no optional fields",
            type: ["WebApplication"],
          },
        ],
      };

      const result = getProjectsScheme(input);

      expect(result.hasPart[0]).not.toHaveProperty("applicationCategory");
      expect(result.hasPart[0]).not.toHaveProperty("operatingSystem");
      expect(result.hasPart[0]).not.toHaveProperty("codeRepository");
      expect(result.hasPart[0]).not.toHaveProperty("programmingLanguage");
    });

    it("should ensure applicationCategory is omitted when type does not require it", () => {
      const input = {
        title: "Project Without App Category",
        url: "http://example.com/no-app-category",
        description: "Test for omitting applicationCategory",
        projects: [
          {
            title: "Product Only",
            url: "http://example.com/product-only",
            imageUrl: "http://example.com/image.jpg",
            description: "A project with only 'Product' type",
            type: ["Product"],
          },
        ],
      };

      const result = getProjectsScheme(input);
      expect(result.hasPart[0]).not.toHaveProperty("applicationCategory");
    });
  });
});
