import { render, screen } from "@testing-library/react";
import { RelatedBlogs } from "./RelatedBlogs";
import { sanityFetch } from "@/sanity/lib/fetch";
import { relatedBlogsQuery, recentBlogsQuery } from "@/sanity/lib/queries";

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      relatedBlogs: "Related Articles",
    };
    return translations[key] ?? key;
  }),
}));

const mockRelatedBlog = {
  _id: "blog-1",
  title: "Related Post",
  slug: { current: "related-post" },
  publishedAt: "2025-01-01",
  imageURL: "https://example.com/image.jpg",
  tags: [{ _id: "tag-1", label: "Flutter" }],
};

describe("RelatedBlogs", () => {
  beforeEach(() => {
    (sanityFetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when no related blogs are found", async () => {
    (sanityFetch as jest.Mock).mockResolvedValue([]);

    const result = await RelatedBlogs({
      currentSlug: "current-post",
      tags: ["Flutter"],
    });

    expect(result).toBeNull();
    expect(sanityFetch).toHaveBeenCalledWith({
      query: relatedBlogsQuery,
      params: { currentSlug: "current-post", tags: ["Flutter"] },
    });
  });

  it("short-circuits to recentBlogsQuery when tags is empty", async () => {
    (sanityFetch as jest.Mock).mockResolvedValue([mockRelatedBlog]);

    const result = await RelatedBlogs({
      currentSlug: "current-post",
      tags: [],
    });

    expect(result).not.toBeNull();
    expect(sanityFetch).toHaveBeenCalledTimes(1);
    expect(sanityFetch).toHaveBeenCalledWith({
      query: recentBlogsQuery,
      params: { currentSlug: "current-post", excludeIds: [], limit: 3 },
    });
    render(result!);
    expect(screen.getByText("Related Articles")).toBeInTheDocument();
    expect(screen.getByText("Related Post")).toBeInTheDocument();
  });

  it("short-circuits to recentBlogsQuery when tags is undefined", async () => {
    (sanityFetch as jest.Mock).mockResolvedValue([mockRelatedBlog]);

    const result = await RelatedBlogs({
      currentSlug: "current-post",
      tags: undefined as unknown as string[],
    });

    expect(sanityFetch).toHaveBeenCalledWith({
      query: recentBlogsQuery,
      params: { currentSlug: "current-post", excludeIds: [], limit: 3 },
    });
    expect(result).not.toBeNull();
  });

  it("fetches only related blogs when 3+ are found", async () => {
    const threeRelated = [
      mockRelatedBlog,
      { ...mockRelatedBlog, _id: "blog-2", title: "Second" },
      { ...mockRelatedBlog, _id: "blog-3", title: "Third" },
    ];
    (sanityFetch as jest.Mock).mockResolvedValue(threeRelated);

    const result = await RelatedBlogs({
      currentSlug: "current-post",
      tags: ["Flutter"],
    });

    expect(sanityFetch).toHaveBeenCalledTimes(1);
    expect(sanityFetch).toHaveBeenCalledWith({
      query: relatedBlogsQuery,
      params: { currentSlug: "current-post", tags: ["Flutter"] },
    });
    render(result!);
    expect(screen.getByText("Related Post")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("fetches related then recent as fallback when fewer than 3 related", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce([mockRelatedBlog])
      .mockResolvedValueOnce([
        { ...mockRelatedBlog, _id: "blog-2", title: "Recent Post" },
      ]);

    const result = await RelatedBlogs({
      currentSlug: "current-post",
      tags: ["Flutter"],
    });

    expect(sanityFetch).toHaveBeenCalledTimes(2);
    expect(sanityFetch).toHaveBeenNthCalledWith(1, {
      query: relatedBlogsQuery,
      params: { currentSlug: "current-post", tags: ["Flutter"] },
    });
    expect(sanityFetch).toHaveBeenNthCalledWith(2, {
      query: recentBlogsQuery,
      params: {
        currentSlug: "current-post",
        excludeIds: ["blog-1"],
        limit: 2,
      },
    });
    render(result!);
    expect(screen.getByText("Related Post")).toBeInTheDocument();
    expect(screen.getByText("Recent Post")).toBeInTheDocument();
  });
});
