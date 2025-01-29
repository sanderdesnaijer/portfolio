import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Page from "./page";
import { mockProjects } from "@/app/test-utils/mockProjects";

describe("Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page with correct project data", async () => {
    (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjects);

    render(await Page());

    // Check if the title "Projects" is rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Projects"
    );

    // Check if the project titles are rendered
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();

    // Check if the image for the first project is rendered
    expect(screen.getByAltText("Project 1 Image Alt")).toBeInTheDocument();
    expect(screen.getByAltText("Project 2 Image Alt")).toBeInTheDocument();

    // Check if the links are rendered correctly
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
  });

  it("renders correctly when projects are missing", async () => {
    (sanityFetch as jest.Mock).mockResolvedValueOnce([]);

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

    (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjectsWithoutBody);

    render(await Page());

    // Check if the project is rendered without the body content
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.queryByText("Mock body content")).not.toBeInTheDocument();
  });

  it("displays 'No content' if no links are provided", async () => {
    const mockProjectsWithoutLinks = [
      {
        ...mockProjects[0],
        links: [],
      },
    ];

    (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjectsWithoutLinks);

    render(await Page());

    // Ensure no link section is rendered
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });
});
