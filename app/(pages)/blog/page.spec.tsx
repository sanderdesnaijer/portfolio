import { render, screen } from "@testing-library/react";
import Page from "./page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { mockPage } from "@/app/test-utils/mockPage";

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page component with the correct structure", async () => {
    (sanityFetch as jest.Mock).mockResolvedValue(mockBlogPage);

    const { container } = render(await Page());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Blog");

    const gridContainer = container.querySelector("div.grid");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass(
      "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    );

    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass(
      "flex flex-col gap-8 row-start-2 items-center sm:items-start"
    );
  });

  it("renders PageNotFound when page data is not found", async () => {
    (sanityFetch as jest.Mock).mockResolvedValueOnce(null);

    render(await Page());

    expect(sanityFetch).toHaveBeenCalledWith({
      query: expect.any(String),
      params: { slug: "blog" },
    });
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
