import { render, screen } from "@testing-library/react";
import { Project } from "./Project";
import { ProjectTypeSanity } from "@/sanity/types";
import { mockProject } from "../__mocks__/mockProjects";

// Mock `PortableText` and `imageUrlBuilder`
jest.mock("@portabletext/react", () => ({
  PortableText: ({ value }: { value: unknown }) => (
    <div data-testid="portable-text">{JSON.stringify(value)}</div>
  ),
}));
jest.mock("@/sanity/lib/client", () => ({}));
jest.mock("@sanity/image-url", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    image: jest.fn(() => ({
      width: jest.fn(() => ({
        height: jest.fn(() => ({
          url: jest.fn(() => "http://mocked-image-url"),
        })),
      })),
    })),
  })),
}));

describe("Project Component", () => {
  const mockProjectWithoutImage: ProjectTypeSanity = {
    ...mockProject,
    mainImage: null!,
  };

  const mockProjectWithoutBody: ProjectTypeSanity = {
    ...mockProject,
    body: null!,
  };

  const mockProjectWithoutLinks: ProjectTypeSanity = {
    ...mockProject,
    links: null!,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders project details with all data", () => {
    render(<Project project={mockProject} />);

    // Check title and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Project 1"
    );
    expect(
      screen.getByText((content) => content.includes("Mock body content"))
    ).toBeInTheDocument();

    // Check image rendering
    const image = screen.getByAltText("Project 1 Image Alt");
    expect(image).toBeInTheDocument();

    // Assert that the `src` contains the mocked image URL
    expect(image).toHaveAttribute("src");
    expect(image.getAttribute("src")).toContain(
      encodeURIComponent("http://mocked-image-url")
    );

    // Check body content rendering
    expect(screen.getByTestId("portable-text")).toHaveTextContent(
      JSON.stringify(mockProject.body)
    );

    // Check links rendering
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
  });

  it("renders without the image when mainImage is missing", () => {
    render(<Project project={mockProjectWithoutImage} />);

    // Check title and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Project 1"
    );
    expect(
      screen.getByText((content) => content.includes("Mock body content"))
    ).toBeInTheDocument();

    // Ensure no image is rendered
    expect(screen.queryByAltText("Project Image Alt")).not.toBeInTheDocument();
  });

  it("renders without the body when body content is missing", () => {
    render(<Project project={mockProjectWithoutBody} />);

    // Check title and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Project 1"
    );
    expect(screen.queryByText("Mock body content")).not.toBeInTheDocument();

    // Ensure no PortableText is rendered
    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();
  });

  it("renders without links when no links are provided", () => {
    render(<Project project={mockProjectWithoutLinks} />);

    // Check title and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Project 1"
    );

    // Ensure no links are rendered
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("Website")).not.toBeInTheDocument();
  });

  it("renders correctly with an empty project object", () => {
    const emptyProject = {} as ProjectTypeSanity;
    render(<Project project={emptyProject} />);

    // Ensure no content is rendered
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(
      screen.queryByText("This is a project description.")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("portable-text")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Project Image Alt")).not.toBeInTheDocument();
  });
});
