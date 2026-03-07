import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { AUTHOR_NAME } from "./constants";
import {
  getWebsiteScheme,
  getAboutScheme,
  getProjectsScheme,
  getBlogsScheme,
  getArticleScheme,
} from "./jsonLDSchemes";
import { BlogSanity } from "@/sanity/types/blogType";

const mockBaseURL = "https://mocked-url.com";

jest.mock("../../envConfig", () => ({
  baseUrl: "https://mocked-url.com",
}));

describe("utils/jsonLDSchemes", () => {
  describe("getWebsiteScheme", () => {
    it("should return a valid schema with required fields", () => {
      const input: PageSanity = {
        title: "Example Site",
        description: "This is an example site.",
        name: "",
        slug: {
          _type: "slug",
          current: "",
        },
        mainImage: {
          _type: "image",
          asset: {
            _ref: "",
            _type: "",
          },
          alt: undefined,
        },
        publishedAt: "",
        body: [],
        imageAlt: "",
        imageURL: "https://example.com/image.jpg",
        _id: "",
        _rev: "",
        _type: "",
        _createdAt: "2023-01-01T00:00:00Z",
        _updatedAt: "2023-01-02T00:00:00Z",
      };

      const result = getWebsiteScheme(input);

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: mockBaseURL,
        name: input.title,
        description: input.description,
        creator: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        image: input.imageURL,
        dateCreated: input._createdAt,
        dateModified: input._updatedAt,
        inLanguage: "en-US",
      });
    });

    it("should include the authorLink when provided", () => {
      const input: PageSanity = {
        url: "https://example.com",
        title: "Example Site",
        description: "This is an example site.",
        author: "John Doe",
        authorLink: "https://johndoe.com",
        imageURL: "https://example.com/image.jpg",
        _createdAt: "2023-01-01T00:00:00Z",
        _updatedAt: "2023-01-02T00:00:00Z",
        name: "",
        slug: {
          _type: "slug",
          current: "",
        },
        mainImage: {
          _type: "image",
          asset: {
            _ref: "",
            _type: "",
          },
          alt: undefined,
        },
        publishedAt: "",
        body: [],
        imageAlt: "",

        _id: "",
        _rev: "",
        _type: "",
      };

      const result = getWebsiteScheme(input, "https://johndoe.com");
      expect(result.creator.url).toBe("https://johndoe.com");
    });
  });
  describe("getAboutScheme", () => {
    it("should return a valid schema with required fields", () => {
      const page: PageSanity = {
        links: ["https://github.com/user", "https://linkedin.com/in/user"],
        jobTitle: "Software Engineer",
        imageURL: "https://example.com/profile.jpg",
        name: "",
        title: "",
        description: "",
        slug: {
          _type: "slug",
          current: "",
        },
        mainImage: {
          _type: "image",
          asset: {
            _ref: "",
            _type: "",
          },
          alt: undefined,
        },
        publishedAt: "",
        body: [],
        imageAlt: "",
        _id: "",
        _rev: "",
        _type: "",
        _createdAt: "",
        _updatedAt: "",
      };

      const links = [
        "https://github.com/sanderdesnaijer",
        "https://www.linkedin.com/in/sanderdesnaijer",
        "https://gitlab.com/sanderdesnaijer",
      ];

      const result = getAboutScheme({
        page,
        links,
        jobTitle: "Software Engineer",
        jobs: ["Company A", "Company B"],
      });

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Person",
        name: AUTHOR_NAME,
        url: `${mockBaseURL}/`,
        sameAs: links,
        jobTitle: "Software Engineer",
        worksFor: [
          { "@type": "Organization", name: "Company A" },
          { "@type": "Organization", name: "Company B" },
        ],
        image: page.imageURL,
      });
    });

    it("should handle an empty jobs array", () => {
      const page: PageSanity = {
        links: ["https://github.com/user", "https://linkedin.com/in/user"],
        jobTitle: "Software Engineer",
        imageURL: "https://example.com/profile.jpg",
        name: "",
        title: "",
        description: "",
        slug: {
          _type: "slug",
          current: "",
        },
        mainImage: {
          _type: "image",
          asset: {
            _ref: "",
            _type: "",
          },
          alt: undefined,
        },
        publishedAt: "",
        body: [],
        imageAlt: "",
        _id: "",
        _rev: "",
        _type: "",
        _createdAt: "",
        _updatedAt: "",
      };
      const result = getAboutScheme({
        page,
        jobs: [],
        jobTitle: "Software developer",
        links: [],
      });
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
              _key: "jsonld-spec-1",
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
            offers: {
              "@type": "Offer",
              "@id":
                "https://mocked-url.com/projects/flutter-tabata-whip-timer#offer",
              price: "0.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                returnPolicyCategory:
                  "https://schema.org/MerchantReturnNotPermitted",
              },
              shippingDetails: {
                "@type": "OfferShippingDetails",
                doesNotShip: true,
              },
            },
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
              _key: "jsonld-spec-2",
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
      expect(result.hasPart[0]).toHaveProperty("offers");
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
        availability: "https://schema.org/InStock",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          doesNotShip: true,
        },
      });
    });

    it("should not include offers for non-product projects without download url", () => {
      const page = {
        title: "No Offer Project",
        slug: { current: "no-offer" },
        description: "Test for omitting offers when condition is false",
      } as PageSanity;

      const projects = [
        {
          title: "Web App Without Offer",
          slug: { current: "web-app-without-offer" },
          imageURL: "https://example.com/image.jpg",
          body: "A non-product project without download URL",
          jsonLdType: ["WebApplication"],
        },
      ] as unknown as ProjectTypeSanity[];

      const result = getProjectsScheme({ page, projects });

      expect(result.hasPart[0]).not.toHaveProperty("offers");
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

      const articles: BlogSanity[] = [
        {
          _id: "D9fCV9f59UZFiLIMN6Zg5d",
          publishedAt: "2023-10-01T12:00:00.000Z",
          categories: [
            "sanity",
            "web-development",
            "frontend-development",
            "react",
            "nextjs",
          ],
          author: "Sander de Snaijer",
          title: "First Blog Post",
          slug: {
            current:
              "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
          },
          mediumUrl: "https://example.com/first-blog-post",
          excerpt: "A short excerpt of the first blog post.",
          body: [
            {
              _type: "block",
              _key: "jsonld-blog-1",
              children: [
                {
                  text: "First blog post content.",
                  _type: "span",
                  marks: [],
                },
              ],
              style: "normal",
            },
          ],
          _rev: "",
          _type: "blogPost",
          _createdAt: "",
          _updatedAt: "",
        },
        {
          _id: "F1fCV9f59UZFiLIMN6Zg5d",
          publishedAt: "2025-10-02T12:00:00.000Z",
          categories: [
            "sanity",
            "web-development",
            "frontend-development",
            "react",
            "nextjs",
          ],
          author: "Sander de Snaijer",
          title: "Second Blog Post",
          slug: {
            current:
              "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
          },
          mediumUrl: "https://example.com/second-blog-post",
          excerpt: "A short excerpt of the second blog post.",
          body: [
            {
              _type: "block",
              _key: "jsonld-blog-2",
              children: [
                {
                  text: "Second blog post content.",
                  _type: "span",
                  marks: [],
                },
              ],
              style: "normal",
            },
          ],
          _rev: "",
          _type: "blogPost",
          _createdAt: "",
          _updatedAt: "",
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
            "@id":
              "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
            headline: "First Blog Post",
            url: "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
            datePublished: "2023-10-01T12:00:00.000Z",
            author: {
              "@type": "Person",
              name: AUTHOR_NAME,
            },
            publisher: {
              "@type": "Person",
              name: AUTHOR_NAME,
              url: mockBaseURL,
            },
            sameAs: "https://example.com/first-blog-post",
          },
          {
            "@type": "BlogPosting",
            "@id":
              "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
            headline: "Second Blog Post",
            url: "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
            datePublished: "2025-10-02T12:00:00.000Z",
            author: {
              "@type": "Person",
              name: AUTHOR_NAME,
            },
            publisher: {
              "@type": "Person",
              name: AUTHOR_NAME,
              url: mockBaseURL,
            },
            sameAs: "https://example.com/second-blog-post",
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
      const article: BlogSanity = {
        _id: "F1fCV9f59UZFiLIMN6Zg5d",
        publishedAt: "2023-10-01T12:00:00.000Z",
        categories: [
          "sanity",
          "web-development",
          "frontend-development",
          "react",
          "nextjs",
        ],
        author: "Sander de Snaijer",
        title: "Test Article",
        slug: {
          current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        },
        mediumUrl: "https://example.com/test-article",
        excerpt: "This is a test article excerpt.",
        body: [
          {
            _type: "block",
            _key: "jsonld-article-1",
            children: [
              {
                text: "Test article content.",
                _type: "span",
                marks: [],
              },
            ],
            style: "normal",
          },
        ],
        _rev: "",
        _type: "blogPost",
        _createdAt: "",
        _updatedAt: "",
      };

      const result = getArticleScheme(article, "blog");

      expect(result).toEqual({
        "@type": "BlogPosting",
        "@id":
          "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        headline: "Test Article",
        url: "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        datePublished: "2023-10-01T12:00:00.000Z",
        author: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        publisher: {
          "@type": "Person",
          name: AUTHOR_NAME,
          url: mockBaseURL,
        },
        sameAs: "https://example.com/test-article",
      });
    });

    it("should include description when hasDetail is true and excerpt is provided", () => {
      const article: BlogSanity = {
        _id: "F1fCV9f59UZFiLIMN6Zg5d",
        publishedAt: "2023-10-01T12:00:00.000Z",
        categories: [
          "sanity",
          "web-development",
          "frontend-development",
          "react",
          "nextjs",
        ],
        author: "Sander de Snaijer",
        title: "Detailed Article",
        slug: {
          current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        },
        mediumUrl: "https://example.com/detailed-article",
        excerpt: "This is a detailed article.",
        body: [
          {
            _type: "block",
            _key: "jsonld-article-2",
            children: [
              {
                text: "Detailed article content.",
                _type: "span",
                marks: [],
              },
            ],
            style: "normal",
          },
        ],
        _rev: "",
        _type: "blogPost",
        _createdAt: "",
        _updatedAt: "",
      };

      const result = getArticleScheme(article, "blog", true);

      expect(result).toEqual({
        "@type": "BlogPosting",
        "@id":
          "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        headline: "Detailed Article",
        url: "https://mocked-url.com/blog/creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        datePublished: "2023-10-01T12:00:00.000Z",
        author: {
          "@type": "Person",
          name: AUTHOR_NAME,
        },
        publisher: {
          "@type": "Person",
          name: AUTHOR_NAME,
          url: mockBaseURL,
        },
        sameAs: "https://example.com/detailed-article",
        description: "This is a detailed article.",
      });
    });

    it("should not include description when hasDetail is false", () => {
      const article: BlogSanity = {
        publishedAt: "2023-10-01T12:00:00.000Z",
        categories: [
          "sanity",
          "web-development",
          "frontend-development",
          "react",
          "nextjs",
        ],
        author: "Sander de Snaijer",
        title: "Detailed Article",
        slug: {
          current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
        },
        mediumUrl: "https://example.com/detailed-article",
        excerpt: "This is a detailed article.",
        body: [
          {
            _type: "block",
            _key: "jsonld-article-3",
            children: [
              {
                text: "Detailed article content.",
                _type: "span",
                marks: [],
              },
            ],
            style: "normal",
          },
        ],
        _id: "",
        _rev: "",
        _type: "blogPost",
        _createdAt: "",
        _updatedAt: "",
      };

      const result = getArticleScheme(article, "blog", false);

      expect(result).not.toHaveProperty("description");
    });

    it("should not include sameAs when mediumUrl is not provided", () => {
      const article: BlogSanity = {
        _id: "test-id",
        publishedAt: "2023-10-01T12:00:00.000Z",
        categories: ["test"],
        author: "Sander de Snaijer",
        title: "No Medium URL",
        slug: { current: "no-medium-url" },
        body: [
          {
            _type: "block",
            _key: "jsonld-article-4",
            children: [{ text: "Content.", _type: "span", marks: [] }],
            style: "normal",
          },
        ],
        _rev: "",
        _type: "blogPost",
        _createdAt: "",
        _updatedAt: "",
      };

      const result = getArticleScheme(article, "blog");

      expect(result).not.toHaveProperty("sameAs");
    });
  });
});
