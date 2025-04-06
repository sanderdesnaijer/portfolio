import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Page from "./page";
import { mockProjects } from "@/app/test-utils/mockProjects";
import { mockPage, mockPages } from "@/app/test-utils/mockPage";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { mockSetting } from "@/app/test-utils/mockSetting";

describe("app/(pages)/projects/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page with correct project data", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockProjects)
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    // Check if the title "Projects" is rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      mockPage.title
    );

    // Check if the project titles are rendered
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();

    // Check if the image for the first project is rendered
    expect(screen.getByAltText("Project 1 Image Alt")).toBeInTheDocument();
    expect(screen.getByAltText("Project 2 Image Alt")).toBeInTheDocument();

    // Check if the links are rendered correctly
    expect(screen.getAllByRole("link", { name: /github icon/i })).toHaveLength(
      2
    );
    expect(
      screen.getAllByRole("link", { name: /linkedin icon/i })
    ).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /gitlab icon/i })).toHaveLength(
      2
    );
  });

  it("renders correctly when projects are missing", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    // Check if there are no projects rendered
    expect(screen.queryByText("Project 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Project 2")).not.toBeInTheDocument();
  });

  it("renders correctly when a project has no body", async () => {
    const mockProjectsWithoutBody = [
      {
        ...mockProjects[0],
        body: null,
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockProjectsWithoutBody)
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    // Check if the project is rendered without the body content
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.queryByText("Mock body content")).not.toBeInTheDocument();
  });

  it("should show not found if page is not found", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    const message = screen.getByText(
      getTranslationKey("error.404.generic.title")
    );
    expect(message).toBeInTheDocument();
  });

  it("displays 'No content' if no links are provided", async () => {
    const mockProjectsWithoutLinks = [
      {
        ...mockProjects[0],
        links: [],
      },
    ];

    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockProjectsWithoutLinks)
      .mockResolvedValueOnce(mockPage)
      .mockResolvedValueOnce(mockSetting)
      .mockResolvedValueOnce(mockPages);

    render(await Page());

    // Ensure no link section is rendered
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });
});
