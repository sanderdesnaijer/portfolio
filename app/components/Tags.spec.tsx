import React from "react";
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
    const { getByText } = render(<Tags tags={tags} />);
    expect(getByText("Tag1")).toBeInTheDocument();
    expect(getByText("Tag2")).toBeInTheDocument();
  });
});
