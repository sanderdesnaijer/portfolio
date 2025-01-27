import { render, screen } from "@testing-library/react";
import Projects, { truncateText } from "./Projects";
import { ProjectTypeSanity } from "@/sanity/types";
import { Block } from "@/sanity/types/types";

jest.mock("next-sanity", () => ({
  toPlainText: jest.fn(() => "Mock body content"),
}));

jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockedImage = (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  };

  // Add display name here for better debugging
  MockedImage.displayName = "MockedImage";

  return MockedImage;
});
jest.mock("../utils/utils", () => ({
  ...jest.requireActual("../utils/utils"),
  convertDate: jest.fn(() => "Mocked Date"),
}));

const mockProjects: ProjectTypeSanity[] = [
  {
    _id: "1",
    title: "Project 1",
    _createdAt: "2025-01-01",
    slug: { _type: "slug", current: "/project-1" },
    imageURL: "http://mocked-image-url.com/image1.jpg",
    mainImage: {
      _type: "image",
      alt: "Project 1 Image Alt",
      asset: { _ref: "string", _type: "ref" },
    },
    body: [
      { children: [{ text: "This is a project body", _type: "span" }] },
    ] as Block[],
    links: [
      { title: "GitHub", icon: "github", link: "http://test" },
      { title: "Live Demo", icon: "external-link", link: "http://test" },
    ],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
  },
  {
    _id: "2",
    title: "Project 2",
    _createdAt: "2025-01-02",
    slug: { current: "/project-2", _type: "slug" },
    imageURL: "http://mocked-image-url.com/image2.jpg",
    mainImage: {
      _type: "image",
      alt: "Project 2 Image Alt",
      asset: { _ref: "string", _type: "ref" },
    },
    body: null!,
    links: [],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
  },
];

describe("components/Projects", () => {
  describe("truncateText", () => {
    it("should return the original text if it is shorter than or equal to the specified length", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
      expect(truncateText("Hello", 5)).toBe("Hello");
    });

    it('should truncate the text and append "..." if it exceeds the specified length', () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
      expect(truncateText("Hello World", 8)).toBe("Hello Wo...");
    });

    it("should handle an empty string", () => {
      expect(truncateText("", 5)).toBe("");
    });

    it("should handle length of 0", () => {
      expect(truncateText("Hello", 0)).toBe("...");
    });

    it("should work with text shorter than 3 characters and very small lengths", () => {
      expect(truncateText("Hi", 1)).toBe("H...");
      expect(truncateText("A", 0)).toBe("...");
    });
  });

  it("renders a list of projects", () => {
    render(<Projects projects={mockProjects} />);

    // Ensure each project title is rendered
    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });

    // Ensure each project date is rendered
    expect(screen.getAllByText("Mocked Date")).toHaveLength(
      mockProjects.length
    );

    // Ensure images are rendered with correct alt text
    mockProjects.forEach((project) => {
      if (project.mainImage && project.mainImage.alt) {
        expect(screen.getByAltText(project.mainImage.alt)).toBeInTheDocument();
      }
    });

    // Ensure links are rendered correctly
    const githubLinks = screen.getAllByAltText("github icon");
    const liveDemoLinks = screen.getAllByAltText("external-link icon");

    expect(githubLinks.length).toBe(1); // Only one GitHub link
    expect(liveDemoLinks.length).toBe(1); // Only one Live Demo link
  });

  it("renders correctly with no projects", () => {
    render(<Projects projects={[]} />);

    // Ensure no project titles or images are rendered
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders truncated text for the project body", () => {
    render(<Projects projects={mockProjects} />);

    // Ensure truncated text is displayed
    expect(screen.getByText("Mock body content")).toBeInTheDocument();
  });

  it("renders links correctly for a project", () => {
    render(<Projects projects={mockProjects} />);

    // Ensure GitHub and Live Demo links are rendered
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
  });

  it("renders projects with correct href", () => {
    render(<Projects projects={mockProjects} />);

    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title).closest("a")).toHaveAttribute(
        "href",
        project.slug.current
      );
    });
  });
});
