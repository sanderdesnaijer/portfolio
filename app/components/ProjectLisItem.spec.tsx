import { render, screen } from "@testing-library/react";
import { ProjectListItem } from "./ProjectListItem";
import { convertDate } from "../utils/utils";
import { TagSanity } from "@/sanity/types/tagType";

jest.mock("../utils/utils", () => ({
  ...jest.requireActual("../utils/utils"),
  convertDate: jest.fn(),
}));

describe("ProjectListItem Component", () => {
  const mockTags: TagSanity[] = [
    {
      _id: "1",
      label: "React",
      slug: { current: "react" },
      _rev: "",
      _type: "",
      _createdAt: "",
      _updatedAt: "",
    },
    {
      _id: "2",
      label: "Next.js",
      slug: { current: "nextjs" },
      _rev: "",
      _type: "",
      _createdAt: "",
      _updatedAt: "",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the image when imageURL and imageALT are provided", () => {
    render(
      <ProjectListItem
        imageURL="https://example.com/image.jpg"
        imageALT="Example Image"
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    const image = screen.getByAltText("Example Image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("image.jpg"));
  });

  it("does not render the image when imageURL or imageALT is missing", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the title as a link", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    const link = screen.getByRole("link", { name: "Project Title" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/project");
  });

  it("renders the formatted date", () => {
    (convertDate as jest.Mock).mockReturnValue("January 1, 2023");

    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    expect(screen.getByText("January 1, 2023")).toBeInTheDocument();
    expect(convertDate).toHaveBeenCalledWith("2023-01-01");
  });

  it("renders the body text when provided", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
        body="This is a sample project description."
      />
    );

    expect(
      screen.getByText("This is a sample project description.")
    ).toBeInTheDocument();
  });

  it("does not render the body text when not provided", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    expect(
      screen.queryByText("This is a sample project description.")
    ).not.toBeInTheDocument();
  });

  it("renders the tags when provided", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
        tags={mockTags}
      />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("does not render the tags when not provided", () => {
    render(
      <ProjectListItem
        href="/project"
        title="Project Title"
        date="2023-01-01"
      />
    );

    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.queryByText("Next.js")).not.toBeInTheDocument();
  });
});
