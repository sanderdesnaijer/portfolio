import envConfig from "@/envConfig";
import { mockPage } from "../test-utils/mockPage";
import { mockProject } from "../test-utils/mockProjects";
import { AUTHOR_NAME } from "./constants";
import { generateMetaData, generatePageMetadata } from "./metadata";
import { sanityFetch } from "@/sanity/lib/fetch";

describe("app/utils/metadata", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMetaData", () => {
    it("should generate correct metadata with all fields provided", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        author: "John Doe",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
        imageAlt: "Article Image",
        keywords: ["article", "example"],
        canonical: "https://example.com/article",
      };

      const result = generateMetaData(data);

      expect(result.title).toBe(data.title);
      expect(result.description).toBe(data.description);
      expect(result.authors[0].name).toBe(data.author);
      expect(result.openGraph.title).toBe(data.title);
      expect(result.openGraph.images[0].url).toBe(data.imageUrl);
      expect(result.twitter.card).toBe("summary_large_image");
      expect(result.alternates.canonical).toBe(data.canonical);
    });

    it("should use the default author if none is provided", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.authors[0].name).toBe(AUTHOR_NAME);
    });

    it("should not include keywords if none are provided", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.keywords).toBeUndefined();
    });

    it("should include the title as the alt text if no imageAlt is provided", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.openGraph.images[0].alt).toBe(data.title);
      expect(result.twitter.images[0].alt).toBe(data.title);
    });

    it("should use the provided imageAlt if available", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
        imageAlt: "Custom Alt Text",
      };

      const result = generateMetaData(data);

      expect(result.openGraph.images[0].alt).toBe(data.imageAlt);
      expect(result.twitter.images[0].alt).toBe(data.imageAlt);
    });

    it("should use the URL as the canonical if no canonical URL is provided", () => {
      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.alternates.canonical).toBe(data.url);
    });
  });

  describe("generatePageMetadata", () => {
    it("should generate correct metadata without project", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);

      const pageSlug = "page-slug";
      const result = await generatePageMetadata({ pageSlug });

      expect(result.title).toBe(`${AUTHOR_NAME} | My page`);
      expect(result.description).toBe(mockPage.description);
      expect(result.openGraph.title).toBe(`${AUTHOR_NAME} | My page`);
      expect(result.openGraph.images[0].url).toBe(mockPage.imageURL);
      expect(result.keywords).toBeUndefined();
    });

    it("should handle missing project image and use page image", async () => {
      const mockPage = {
        title: "My page",
        description: "Page Description",
        _createdAt: "2025-03-01T00:00:00Z",
        _updatedAt: "2025-03-01T01:00:00Z",
        slug: { current: "page-slug" },
        imageURL: "https://example.com/page-image.png",
        imageAlt: "Page Image",
      };

      const pageSlug = "page-slug";
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);

      const result = await generatePageMetadata({ pageSlug });

      expect(result.openGraph.images[0].url).toBe(mockPage.imageURL);
    });

    it("should generate a correct URL", async () => {
      const pageSlug = "page-slug";
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);

      const result = await generatePageMetadata({ pageSlug });

      expect(result.openGraph.url).toBe(`${envConfig.baseUrl}/page-slug`);
    });

    it("should generate correct metadata with project provided", async () => {
      const pageSlug = "page-slug";
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(mockProject);

      const result = await generatePageMetadata({
        pageSlug,
        project: mockProject,
      });

      expect(result.title).toBe(`${AUTHOR_NAME} | My page | Project 1`);
      expect(result.description).toBe("Mock body content");
      expect(result.openGraph.title).toBe(
        `${AUTHOR_NAME} | My page | Project 1`
      );
      expect(result.openGraph.images[0].url).toBe(mockProject.imageURL);
      expect(result.keywords).toEqual(["React", "Typescript"]);
    });

    it("should correctly set publishedTime and modifiedTime without project", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);
      const pageSlug = "page-slug";
      const result = await generatePageMetadata({ pageSlug });

      expect(result.openGraph.publishedTime).toBe(mockPage._createdAt);
      expect(result.openGraph.modifiedTime).toBe(mockPage._updatedAt);
    });

    it("should correctly set publishedTime and modifiedTime with project", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);
      const pageSlug = "page-slug";
      const result = await generatePageMetadata({
        pageSlug,
        project: mockProject,
      });

      expect(result.openGraph.publishedTime).toBe(mockProject._createdAt);
      expect(result.openGraph.modifiedTime).toBe(mockProject._updatedAt);
    });
  });
});
