import { render, screen } from "@testing-library/react";
import Page from "./page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { mockPage } from "@/app/test-utils/mockPage";
import { MediumArticle } from "@/app/utils/fetchMedium";

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        status: "ok",
        feed: {
          url: "https://medium.com/feed/@john_doe",
          title: "Stories by John Doe on Medium",
          link: "https://medium.com/@john_doe?source=rss-asdadasd------2",
          author: "",
          description: "Stories by John Doe on Medium",
          image: "https://nonexistent-image-url.com/image.jpeg",
        },
        items: [
          {
            title: "Building a Smart Home with Raspberry Pi",
            pubDate: "2025-02-09 11:18:24",
            link: "https://medium.com/@john_doe/building-a-smart-home-with-raspberry-pi-asdsadasd?source=rss-adasdsd------2",
            guid: "https://medium.com/p/asdads",
            author: "John Doe",
            thumbnail: "",
            description:
              "<p>In this post, I show you how to build a smart home using a Raspberry Pi. It’s an easy project for beginners and helps you learn about IoT and automation.</p><img src='https://nonexistent-image-url.com/raspberry-pi.jpeg' alt='Raspberry Pi Setup'>",
            content:
              "This project walks you through setting up a Raspberry Pi to control various smart devices in your home. I use MQTT for communication between devices and explore different sensors and controllers.",
            categories: ["tag1", "tag2"],
          } as MediumArticle,
        ],
      }),
  })
);

describe("app/(pages)/blog/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page component with the correct structure", async () => {
    (sanityFetch as jest.Mock).mockResolvedValue(mockBlogPage);

    const { container } = render(await Page());

    const gridContainer = container.querySelector("div.grid");
    expect(gridContainer).toBeInTheDocument();

    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
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
