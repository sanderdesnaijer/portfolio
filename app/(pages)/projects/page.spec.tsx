import { render, screen, waitFor } from "@testing-library/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Page from "./page";

// Mock external modules and functions
jest.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("next-sanity", () => ({
  ...jest.requireActual("next-sanity"),
  toPlainText: jest.fn(() => "Mocked plain text"),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => <img src={src} alt={alt} width={width} height={height} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Page Component", () => {
  const mockProjects = [
    {
      _id: "project-1",
      title: "Project One",
      _createdAt: "2023-01-01",
      slug: { current: "project-one" },
      mainImage: { alt: "Project One Image" },
      imageURL: "mock-image-url",
      body: [{ type: "text", children: [{ text: "Mock body content" }] }],
      links: [
        {
          title: "GitHub",
          icon: "github",
        },
      ],
    },
    {
      _id: "project-2",
      title: "Project Two",
      _createdAt: "2023-02-01",
      slug: { current: "project-two" },
      mainImage: { alt: "Project Two Image" },
      imageURL: "mock-image-url-2",
      body: [
        {
          type: "text",
          children: [{ text: "Mock body content for second project" }],
        },
      ],
      links: [
        {
          title: "LinkedIn",
          icon: "linkedin",
        },
      ],
    },
  ];

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
    expect(screen.getByText("Project One")).toBeInTheDocument();
    expect(screen.getByText("Project Two")).toBeInTheDocument();

    // Check if the image for the first project is rendered
    expect(screen.getByAltText("Project One Image")).toBeInTheDocument();
    expect(screen.getByAltText("Project Two Image")).toBeInTheDocument();

    // Check if the links are rendered correctly
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("renders correctly when projects are missing", async () => {
    (sanityFetch as jest.Mock).mockResolvedValueOnce([]);

    render(await Page());

    // Check if there are no projects rendered
    expect(screen.queryByText("Project One")).not.toBeInTheDocument();
    expect(screen.queryByText("Project Two")).not.toBeInTheDocument();
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
    expect(screen.getByText("Project One")).toBeInTheDocument();
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
