import { render, screen } from "@testing-library/react";
import Page from "./page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { mockPage } from "@/app/test-utils/mockPage";
import { BlogSanity } from "@/sanity/types/blogType";

const mockBlogPage: PageSanity = {
  ...mockPage,
  name: "Blog",
  title: "Blog",
  description: "Blog description",
  slug: {
    _type: "slug",
    current: "blog",
  },
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-123",
      _type: "reference",
    },
    alt: "Main image",
  },
  publishedAt: "2023-01-01",
  imageAlt: "Image alt text",
  imageURL: "https://example.com/image.jpg",
  _createdAt: "2023-01-01T00:00:00Z",
  _updatedAt: "2023-01-01T00:00:00Z",
};

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
      current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
    },
    excerpt: "A short excerpt of the first blog post for display in listings.",
    body: [
      {
        _type: "block",
        _key: "blog-post-1",
        children: [
          {
            text: "First blog post content here.",
            _type: "span",
            marks: [],
          },
        ],
        style: "normal",
      },
    ],
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-mock-ref",
        _type: "reference",
      },
      alt: "Blog post image",
    },
    imageURL: "/testimage.png",
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
      current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
    },
    excerpt: "A short excerpt of the second blog post for display in listings.",
    body: [
      {
        _type: "block",
        _key: "blog-post-2",
        children: [
          {
            text: "Second blog post content here.",
            _type: "span",
            marks: [],
          },
        ],
        style: "normal",
      },
    ],
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-mock-ref-2",
        _type: "reference",
      },
      alt: "Blog post image 2",
    },
    imageURL: "/testimage.png",
    _rev: "",
    _type: "blogPost",
    _createdAt: "",
    _updatedAt: "",
  },
];

describe("app/(pages)/blog/page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    (sanityFetch as jest.Mock).mockReset();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page component with the correct structure", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockBlogPage)
      .mockResolvedValueOnce(articles);

    const { container } = render(await Page());

    const gridContainer = container.querySelector("div.grid");
    expect(gridContainer).toBeInTheDocument();
  });

  it("renders PageNotFound when page data is not found", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    render(await Page());

    expect(sanityFetch).toHaveBeenCalledWith({
      query: expect.any(String),
      params: { slug: "blog" },
    });
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
