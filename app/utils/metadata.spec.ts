import envConfig from "@/envConfig";
import { mockPage } from "../test-utils/mockPage";
import { mockProject } from "../test-utils/mockProjects";
import { mockSetting as baseSettingMock } from "../test-utils/mockSetting";
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
      };

      const result = generateMetaData(data);

      expect(result.title).toBe(data.title);
      expect(result.description).toBe(data.description);
      expect(result.authors[0].name).toBe(data.author);
      expect(result.openGraph.title).toBe(data.title);
      expect(result.openGraph.images[0].url).toBe(data.imageUrl);
      expect(result.twitter.card).toBe("summary_large_image");
      expect(result.openGraph.site_name).toBe(data.title);
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

    it("should include Google site verification when env var is set", () => {
      const originalValue = envConfig.googleSiteVerification;
      envConfig.googleSiteVerification = "test-verification-code";

      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.verification).toEqual({
        google: "test-verification-code",
      });

      // Restore original value
      envConfig.googleSiteVerification = originalValue;
    });

    it("should not include verification when googleSiteVerification is not set", () => {
      const originalValue = envConfig.googleSiteVerification;
      envConfig.googleSiteVerification = undefined;

      const data = {
        title: "Article Title",
        description: "Article Description",
        url: "https://example.com/article",
        publishedTime: "2025-03-01T00:00:00Z",
        modifiedTime: "2025-03-01T01:00:00Z",
        imageUrl: "https://example.com/image.png",
      };

      const result = generateMetaData(data);

      expect(result.verification).toBeUndefined();

      // Restore original value
      envConfig.googleSiteVerification = originalValue;
    });
  });

  describe("generatePageMetadata", () => {
    it("should generate correct metadata without project", async () => {
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockPage);

      const pageSlug = "page-slug";
      const result = await generatePageMetadata({ pageSlug });

      expect(result.title).toBe(`My page | ${AUTHOR_NAME}`);
      expect(result.description).toBe(mockPage.description);
      expect(result.openGraph.title).toBe(`My page | ${AUTHOR_NAME}`);
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
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({
        pageSlug,
        project: mockProject,
      });

      expect(result.title).toBe(`Project 1 | ${AUTHOR_NAME}`);

      expect(result.description).toBe("Mock body content");
      expect(result.openGraph.title).toBe(`Project 1 | ${AUTHOR_NAME}`);
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

    it("should use setting.imageURL as a fallback if no project or page imageURL is provided", async () => {
      const mockPage = {
        title: "Page Title",
        description: "Page Description",
        _createdAt: "2025-03-01T00:00:00Z",
        _updatedAt: "2025-03-01T01:00:00Z",
        slug: { current: "page-slug" },
      };

      const mockSetting = {
        imageURL: "https://example.com/setting-image.png",
      };

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(mockSetting);

      const result = await generatePageMetadata({ pageSlug: "page-slug" });

      expect(result.openGraph.images[0].url).toBe(mockSetting.imageURL);
    });

    it("should use setting.imageALT as a fallback if no project or page imageALT is provided", async () => {
      const mockPage = {
        title: "Page Title",
        description: "Page Description",
        _createdAt: "2025-03-01T00:00:00Z",
        _updatedAt: "2025-03-01T01:00:00Z",
        slug: { current: "page-slug" },
      };

      const mockSetting = {
        imageAlt: "Default Setting Image Alt",
      };

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(mockSetting);

      const result = await generatePageMetadata({ pageSlug: "page-slug" });

      expect(result.openGraph.images[0].alt).toBe(mockSetting.imageAlt);
    });

    it("should use setting.description as a fallback if no project or page description is provided", async () => {
      const mockPage = {
        title: "Page Title",
        _createdAt: "2025-03-01T00:00:00Z",
        _updatedAt: "2025-03-01T01:00:00Z",
        slug: { current: "page-slug" },
      };

      const mockSetting = {
        description: "Default Setting Description",
      };

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(mockSetting);

      const result = await generatePageMetadata({ pageSlug: "page-slug" });

      expect(result.description).toBe(mockSetting.description);
    });

    it("should use pageTitle override instead of the Sanity page title", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({
        pageSlug: "page-slug",
        pageTitle: "Custom SEO Base Title",
      });

      expect(result.title).toBe(`Custom SEO Base Title | ${AUTHOR_NAME}`);
    });

    it("should omit the brand suffix when disableBrandTitleSuffix is true", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({
        pageSlug: "page-slug",
        pageTitle: "Already Branded Title",
        disableBrandTitleSuffix: true,
      });

      expect(result.title).toBe("Already Branded Title");
    });

    it("should use envConfig.baseUrl when pageSlug is empty", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({
        pageSlug: "",
        pageTitle: "Home",
        disableBrandTitleSuffix: true,
      });

      expect(result.openGraph.url).toBe(envConfig.baseUrl);
    });

    it("should prefer description override over page, project body, and setting descriptions", async () => {
      const pageWithDescription = {
        ...mockPage,
        description: "Description from page document",
      };
      const mockSetting = {
        description: "Description from settings",
      };

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(pageWithDescription)
        .mockResolvedValueOnce(mockSetting);

      const override = "Explicit meta description override";

      const withoutProject = await generatePageMetadata({
        pageSlug: "page-slug",
        description: override,
      });
      expect(withoutProject.description).toBe(override);

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(pageWithDescription)
        .mockResolvedValueOnce(mockSetting);

      const withProject = await generatePageMetadata({
        pageSlug: "page-slug",
        project: mockProject,
        description: override,
      });
      expect(withProject.description).toBe(override);
    });

    it("should fall back to the brand when no page, project, or pageTitle are available", async () => {
      const mockSetting = {
        title: "Site Brand",
        description: "Default Setting Description",
      };

      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockSetting);

      const result = await generatePageMetadata({ pageSlug: "missing-slug" });

      expect(result.title).toBe("Site Brand | Site Brand");
      expect(result.description).toBe(mockSetting.description);
    });

    it("should prefer page.seoTitleBase from Sanity over the pageTitle override", async () => {
      const pageWithSeoTitle = {
        ...mockPage,
        seoTitleBase: "Sanity SEO Base",
      };
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(pageWithSeoTitle)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({
        pageSlug: "page-slug",
        pageTitle: "Legacy Override",
      });

      expect(result.title).toBe(`Sanity SEO Base | ${AUTHOR_NAME}`);
    });

    it("should omit the brand suffix when page.disableBrandTitleSuffix is true", async () => {
      const pageWithFlag = {
        ...mockPage,
        seoTitleBase: "Already Branded From Sanity",
        disableBrandTitleSuffix: true,
      };
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(pageWithFlag)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({ pageSlug: "page-slug" });

      expect(result.title).toBe("Already Branded From Sanity");
    });

    it("should fall back from seoTitleBase to page.title when seoTitleBase is missing", async () => {
      (sanityFetch as jest.Mock)
        .mockResolvedValueOnce(mockPage)
        .mockResolvedValueOnce(undefined);

      const result = await generatePageMetadata({ pageSlug: "page-slug" });

      expect(result.title).toBe(`My page | ${AUTHOR_NAME}`);
    });

    it("should use pre-fetched page and setting when provided", async () => {
      const result = await generatePageMetadata({
        pageSlug: "page-slug",
        pageTitle: "Custom SEO Base Title",
        page: mockPage,
        setting: baseSettingMock,
      });

      expect(sanityFetch).not.toHaveBeenCalled();
      expect(result.title).toBe(
        `Custom SEO Base Title | ${baseSettingMock.title}`
      );
      expect(result.description).toBe(baseSettingMock.description);
    });
  });
});
