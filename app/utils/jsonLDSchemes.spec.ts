import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { AUTHOR_NAME } from "./constants";
import {
  getWebsiteScheme,
  getAboutScheme,
  getProjectsScheme,
  getBlogsScheme,
  getArticleScheme,
} from "./jsonLDSchemes";
import { MediumArticle } from "../api/medium/types";

const mockBaseURL = "https://mocked-url.com";
describe("utils/jsonLDSchemes", () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BASE_URL = mockBaseURL;
  });

  afterAll(() => {
    // Clean up after the tests to avoid side effects on other tests
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

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
      const page = {
        title: "Projects",
        slug: { current: "projects" },
        description: "A selection of projects I have worked on",
      } as PageSanity;

      const projects: ProjectTypeSanity[] = [
        {
          title: "Flutter Tabata whip timer",
          slug: {
            current: "flutter-tabata-whip-timer",
            _type: "slug",
          },
          imageURL:
            "https://cdn.test.io/images/c6ybobx3/production/1xs367222ba8434fdb83e7481e83391bf604795-2200x1160.png",

          body: [
            {
              _type: "block",
              children: [
                {
                  text: "Building my first Flutter app has been an exciting journey...",
                  _type: "span",
                  marks: [],
                },
              ],
              style: "",
            },
          ],
          jsonLdType: ["SoftwareApplication", "Product"],
          jsonLdApplicationCategory: "MobileApplication",
          jsonLdOperatingSystem: "iOS",
          publishedAt: "",
          _id: "",
          _rev: "",
          _type: "",
          _createdAt: "",
          _updatedAt: "",
        },
      ];

      const result = getProjectsScheme({ page, projects });
      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Projects",
        url: "https://mocked-url.com/projects",
        description: "A selection of projects I have worked on",
        hasPart: [
          {
            "@type": ["SoftwareApplication", "Product"],
            "@id": "https://mocked-url.com/projects/flutter-tabata-whip-timer",
            name: "Flutter Tabata whip timer",
            url: "https://mocked-url.com/projects/flutter-tabata-whip-timer",
            image:
              "https://cdn.test.io/images/c6ybobx3/production/1xs367222ba8434fdb83e7481e83391bf604795-2200x1160.png",
            operatingSystem: "iOS",
            description:
              "Building my first Flutter app has been an exciting journey...",
            applicationCategory: "MobileApplication",
          },
        ],
      });
    });

    it("should handle a project with multiple types correctly", () => {
      const page = {
        title: "Test Project",
        slug: { current: "test" },
        description: "Testing project schema",
      } as PageSanity;

      const projects: ProjectTypeSanity[] = [
        {
          title: "Multi-Type Project",
          slug: {
            current: "multi-type-project",
            _type: "slug",
          },
          imageURL: "https://example.com/image.jpg",
          body: [
            {
              _type: "block",
              children: [
                {
                  text: "A project with multiple types",
                  _type: "span",
                  marks: [],
                },
              ],
              style: "",
            },
          ],
          jsonLdType: ["SoftwareSourceCode", "WebApplication"],
          jsonLdApplicationCategory: "WebApp",
          jsonLdCodeRepository: "https://github.com/example",
          jsonLdProgrammingLanguage: "JavaScript",
          publishedAt: "",
          _id: "",
          _rev: "",
          _type: "",
          _createdAt: "",
          _updatedAt: "",
        },
      ];

      const result = getProjectsScheme({ page, projects });

      expect(result.hasPart[0]["@type"]).toEqual([
        "SoftwareSourceCode",
        "WebApplication",
      ]);
      expect(result.hasPart[0].applicationCategory).toEqual("WebApp");
    });

    it("should handle missing optional fields", () => {
      const page = {
        title: "Minimal Project",
        slug: { current: "minimal" },
        description: "Minimal schema test",
      } as PageSanity;

      const projects = [
        {
          title: "Simple Project",
          slug: { current: "simple" },
          imageURL: "https://example.com/image.jpg",
          body: "A simple project with no optional fields",
          jsonLdType: ["WebApplication"],
        },
      ] as unknown as ProjectTypeSanity[];

      const result = getProjectsScheme({ page, projects });

      expect(result.hasPart[0]).not.toHaveProperty("applicationCategory");
      expect(result.hasPart[0]).not.toHaveProperty("operatingSystem");
      expect(result.hasPart[0]).not.toHaveProperty("codeRepository");
      expect(result.hasPart[0]).not.toHaveProperty("programmingLanguage");
    });

    it("should ensure applicationCategory is omitted when type does not require it", () => {
      const page = {
        title: "Project Without App Category",
        slug: { current: "no-app-category" },
        description: "Test for omitting applicationCategory",
      } as PageSanity;

      const projects = [
        {
          title: "Product Only",
          slug: { current: "product-only" },
          imageURL: "https://example.com/image.jpg",
          body: "A project with only 'Product' type",
          jsonLdType: ["Product"],
        },
      ] as unknown as ProjectTypeSanity[];

      const result = getProjectsScheme({ page, projects });
      expect(result.hasPart[0]).not.toHaveProperty("applicationCategory");
    });

    it("should include downloadUrl and offers when jsonLdDownloadUrl is provided", () => {
      const page = {
        title: "Downloadable Project",
        slug: { current: "downloadable" },
        description: "Test for downloadable project schema",
      } as PageSanity;

      const projects = [
        {
          title: "Downloadable App",
          slug: { current: "downloadable-app" },
          imageURL: "https://example.com/image.jpg",
          body: "A project with a download URL",
          jsonLdType: ["SoftwareApplication"],
          jsonLdDownloadUrl: "https://example.com/download",
        },
      ] as unknown as ProjectTypeSanity[];

      const result = getProjectsScheme({ page, projects });

      expect(result.hasPart[0].downloadUrl).toBe(
        "https://example.com/download"
      );
      expect(result.hasPart[0].offers).toEqual({
        "@type": "Offer",
        "@id": "https://mocked-url.com/downloadable/downloadable-app#offer",
        price: "0.00",
        priceCurrency: "USD",
        availability: "https://schema.org/OnlineOnly",
      });
    });

    it("should include author and publisher when jsonLdIsAuthor is true", () => {
      const page = {
        title: "Author Project",
        slug: { current: "author-project" },
        description: "Test for author and publisher inclusion",
      } as PageSanity;

      const projects = [
        {
          title: "Authored Project",
          slug: { current: "authored-project" },
          imageURL: "https://example.com/image.jpg",
          body: "A project authored by the creator",
          jsonLdType: ["SoftwareApplication"],
          jsonLdIsAuthor: true,
        },
      ] as unknown as ProjectTypeSanity[];

      const result = getProjectsScheme({ page, projects });

      expect(result.hasPart[0].author).toEqual({
        "@type": "Person",
        name: AUTHOR_NAME,
      });
      expect(result.hasPart[0].publisher).toEqual({
        "@type": "Person",
        name: AUTHOR_NAME,
      });
    });
  });

  describe("getBlogsScheme", () => {
    it("should return a valid schema for a blog page with articles", () => {
      const page = {
        title: "My Blog",
        slug: { current: "blog" },
        description: "A collection of my blog posts",
      } as PageSanity;

      const articles: MediumArticle[] = [
        {
          title: "First Blog Post",
          link: "https://example.com/first-blog-post",
          pubDate: "2023-10-01T12:00:00Z",
          author: "",
          categories: [],
          content: "",
          description: "",
          enclosure: {},
          guid: "",
          thumbnail: null,
        },
        {
          title: "Second Blog Post",
          link: "https://example.com/second-blog-post",
          pubDate: "2023-10-02T12:00:00Z",
          author: "",
          categories: [],
          content: "",
          description: "",
          enclosure: {},
          guid: "",
          thumbnail: null,
        },
      ];

      const result = getBlogsScheme({ page, articles });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "My Blog",
        url: "https://mocked-url.com/blog",
        blogPost: [
          {
            "@type": "BlogPosting",
            "@id": "https://example.com/first-blog-post",
            headline: "First Blog Post",
            url: "https://example.com/first-blog-post",
            datePublished: "2023-10-01T12:00:00.000Z",
            author: {
              "@type": "Person",
              name: AUTHOR_NAME,
            },
            publisher: {
              "@type": "Organization",
              name: "Medium",
              url: "https://medium.com",
            },
          },
          {
            "@type": "BlogPosting",
            "@id": "https://example.com/second-blog-post",
            headline: "Second Blog Post",
            url: "https://example.com/second-blog-post",
            datePublished: "2023-10-02T12:00:00.000Z",
            author: {
              "@type": "Person",
              name: AUTHOR_NAME,
            },
            publisher: {
              "@type": "Organization",
              name: "Medium",
              url: "https://medium.com",
            },
          },
        ],
      });
    });

    it("should handle an empty articles array", () => {
      const page = {
        title: "Empty Blog",
        slug: { current: "empty-blog" },
        description: "A blog with no articles",
      } as PageSanity;

      const result = getBlogsScheme({ page, articles: [] });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Empty Blog",
        url: "https://mocked-url.com/empty-blog",
        blogPost: [],
      });
    });
  });
  describe("getArticleScheme", () => {
    it("should return a valid schema for a blog article", () => {
      const article: MediumArticle = {
        title: "Test Article",
        link: "https://example.com/test-article",
        pubDate: "2023-10-01T12:00:00Z",
        author: "",
        categories: [],
        content: "",
        description: "",
        enclosure: {},
        guid: "",
        thumbnail: null,
      };

      const result = getArticleScheme(article);

      expect(result).toEqual({
        "@type": "BlogPosting",
        "@id": "https://example.com/test-article",
        headline: "Test Article",
        url: "https://example.com/test-article",
        datePublished: "2023-10-01T12:00:00.000Z",
        author: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: "Medium",
          url: "https://medium.com",
        },
      });
    });

    it("should include description when hasDetail is true and description is provided", () => {
      const article: MediumArticle = {
        title: "Detailed Article",
        link: "https://example.com/detailed-article",
        pubDate: "2023-10-01T12:00:00Z",
        author: "",
        categories: [],
        content: "",
        description: "<p>This is a detailed article.</p>",
        enclosure: {},
        guid: "",
        thumbnail: null,
      };

      const result = getArticleScheme(article, true);

      expect(result).toEqual({
        "@type": "BlogPosting",
        "@id": "https://example.com/detailed-article",
        headline: "Detailed Article",
        url: "https://example.com/detailed-article",
        datePublished: "2023-10-01T12:00:00.000Z",
        author: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: "Medium",
          url: "https://medium.com",
        },
        description: "This is a detailed article.",
      });
    });

    it("should not include description when hasDetail is false", () => {
      const article: MediumArticle = {
        title: "No Detail Article",
        link: "https://example.com/no-detail-article",
        pubDate: "2023-10-01T12:00:00Z",
        author: "",
        categories: [],
        content: "",
        description: "<p>This description should not appear.</p>",
        enclosure: {},
        guid: "",
        thumbnail: null,
      };

      const result = getArticleScheme(article, false);

      expect(result).not.toHaveProperty("description");
    });
  });
});
