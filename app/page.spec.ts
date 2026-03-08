import { render, screen } from "@testing-library/react";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

import Home from "./page";
import { getTranslationKey } from "./test-utils/i18n";
import { mockPage, mockPages } from "./test-utils/mockPage";
import { AUTHOR_NAME } from "./utils/constants";

const mockSanityFetch = sanityFetch as jest.Mock;

const mockLatestProjects = [
  {
    _id: "proj-1",
    title: "Project One",
    slug: { current: "project-one" },
    publishedAt: "2025-01-01",
    tags: [{ _id: "tag-1", label: "Next.js" }],
  },
  {
    _id: "proj-2",
    title: "Project Two",
    slug: { current: "project-two" },
    publishedAt: "2024-06-01",
    tags: [{ _id: "tag-2", label: "React Native" }],
  },
];

const mockLatestPost = {
  _id: "blog-1",
  title: "Blog Post One",
  slug: { current: "blog-post-one" },
  publishedAt: "2025-02-01",
  tags: [],
};

function setupMocks(settingsOverride?: Record<string, unknown>) {
  const mockSettings = settingsOverride ?? {
    description: "Test Description",
    socialMedia: [
      { icon: "facebook", link: "https://facebook.com" },
      { icon: "twitter", link: "https://twitter.com" },
    ],
  };

  mockSanityFetch
    .mockResolvedValueOnce(mockSettings) // settingsQuery
    .mockResolvedValueOnce(mockPage) // pageQuery
    .mockResolvedValueOnce(mockLatestProjects) // latestProjectsQuery
    .mockResolvedValueOnce([mockLatestPost]) // latestBlogQuery
    .mockResolvedValueOnce(mockPages); // allPagesQuery
}

describe("app/page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Page not found' when sanityFetch returns null", async () => {
    mockSanityFetch.mockResolvedValue(null).mockResolvedValueOnce(null);

    render(await Home());
    expect(
      screen.getByText(getTranslationKey("error.404.generic.description"))
    ).toBeInTheDocument();
  });

  it("renders the Home page with settings data", async () => {
    setupMocks();

    render(await Home());

    expect(screen.getByText(AUTHOR_NAME)).toBeInTheDocument();
    expect(screen.getAllByTestId("mocked-svg")).toHaveLength(3);
  });

  it("renders latest projects and blog post", async () => {
    setupMocks();

    render(await Home());

    expect(screen.getByText("Project One")).toBeInTheDocument();
    expect(screen.getByText("Project Two")).toBeInTheDocument();
    expect(screen.getByText("Blog Post One")).toBeInTheDocument();
  });

  it("calls sanityFetch with the correct query", async () => {
    setupMocks({ title: "Test Title", socialMedia: [] });

    await Home();

    expect(mockSanityFetch).toHaveBeenCalledWith({
      query: settingsQuery,
    });
  });
});
