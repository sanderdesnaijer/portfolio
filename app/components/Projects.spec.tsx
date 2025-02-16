import { render, screen } from "@testing-library/react";
import Projects, { truncateText } from "./Projects";
import { ProjectTypeSanity } from "@/sanity/types";
import { mockProjects } from "../test-utils/mockProjects";

jest.mock("../utils/utils", () => ({
  ...jest.requireActual("../utils/utils"),
  convertDate: jest.fn(() => "Mocked Date"),
}));

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

    it("should truncate text longer than the specified length", () => {
      const longText = "This is a very long text that needs to be truncated.";
      const truncatedText = truncateText(longText, 20);
      expect(truncatedText).toBe("This is a very long ...");
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
    render(<Projects pageSlug="projects" projects={mockProjects} />);

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
  });

  it("renders correctly with no projects", () => {
    render(<Projects pageSlug="projects" projects={[]} />);

    // Ensure no project titles or images are rendered
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders truncated text for the project body", () => {
    render(<Projects pageSlug="projects" projects={mockProjects} />);

    // Ensure truncated text is displayed
    expect(screen.getByText("Mock body content")).toBeInTheDocument();
    const images = screen.queryAllByRole("img");
    images.forEach((img, index) => {
      expect(img.getAttribute("src")).toContain(
        encodeURIComponent(mockProjects[index].imageURL)
      );
      expect(img.getAttribute("alt")).toEqual(
        mockProjects[index].mainImage!.alt
      );
    });
  });

  it("renders projects with correct href", () => {
    const props = {
      pageSlug: "projects",
      projects: mockProjects,
    };
    render(<Projects {...props} />);

    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title).closest("a")).toHaveAttribute(
        "href",
        `/${props.pageSlug}/${project.slug.current}`
      );
    });
  });

  it("does not render body text when project body is null or empty", () => {
    const mockProjectsWithEmptyBody: ProjectTypeSanity[] = [
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
        body: [], // Empty array
        links: [],
        publishedAt: "",
        _updatedAt: "",
        _rev: "",
        _type: "",
      },
    ];

    render(
      <Projects pageSlug="projects" projects={mockProjectsWithEmptyBody} />
    );

    // Ensure that no body text is rendered (even if body is an empty array)
    expect(screen.queryByText("Mock body content")).not.toBeInTheDocument();
  });
});
