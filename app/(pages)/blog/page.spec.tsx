import { render, screen } from "@testing-library/react";
import Page from "./page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { mockPage, mockPages } from "@/app/test-utils/mockPage";
import { mockSetting } from "@/app/test-utils/mockSetting";

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
      .mockResolvedValueOnce(mockPages);

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
