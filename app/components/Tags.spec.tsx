import { render } from "@testing-library/react";
import { Tags } from "./Tags";
import { TagSanity } from "@/sanity/types/tagType";

describe("app/components/Tags", () => {
  it("renders null when there are no tags", () => {
    const { container } = render(<Tags tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a list of tags", () => {
    const tags: TagSanity[] = [
      {
        _id: "1",
        label: "Tag1",
        _rev: "",
        _type: "",
        _createdAt: "",
        _updatedAt: "",
      },
      {
        _id: "2",
        label: "Tag2",
        _rev: "",
        _type: "",
        _createdAt: "",
        _updatedAt: "",
      },
    ];
    const { getByRole } = render(<Tags tags={tags} />);

    const tag1Link = getByRole("link", { name: "Tag1" });
    const tag2Link = getByRole("link", { name: "Tag2" });

    expect(tag1Link).toBeInTheDocument();
    expect(tag1Link).toHaveAttribute("href", "/tags/tag1");
    expect(tag2Link).toBeInTheDocument();
    expect(tag2Link).toHaveAttribute("href", "/tags/tag2");
  });

  it("renders plain text tags when renderLinks is false", () => {
    const tags: TagSanity[] = [
      {
        _id: "1",
        label: "React",
        _rev: "",
        _type: "",
        _createdAt: "",
        _updatedAt: "",
      },
    ];

    const { queryByRole, getByText } = render(
      <Tags tags={tags} renderLinks={false} />
    );

    expect(getByText("React")).toBeInTheDocument();
    expect(queryByRole("link", { name: "React" })).toBeNull();
  });
});
