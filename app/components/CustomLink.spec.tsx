import { render } from "@testing-library/react";
import { CustomLink } from "./CustomLink";

describe("app/components/CustomLink", () => {
  it("renders an external link with target _blank and rel noopener noreferrer", () => {
    const { getByRole } = render(
      <CustomLink href="https://github.com/example" title="GitHub" />
    );

    const link = getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders an internal link with target _self and no rel", () => {
    const { getByRole } = render(
      <CustomLink href="/projects/my-project" title="My Project" />
    );

    const link = getByRole("link", { name: "My Project" });
    expect(link).toHaveAttribute("href", "/projects/my-project");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("renders a hash link as internal", () => {
    const { getByRole } = render(
      <CustomLink href="#resources" title="Resources" />
    );

    const link = getByRole("link", { name: "Resources" });
    expect(link).toHaveAttribute("href", "#resources");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("respects an explicit target override for internal links", () => {
    const { getByRole } = render(
      <CustomLink href="/blog/some-post" title="Blog Post" target="_blank" />
    );

    const link = getByRole("link", { name: "Blog Post" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("respects an explicit target override for external links", () => {
    const { getByRole } = render(
      <CustomLink href="https://example.com" title="Example" target="_self" />
    );

    const link = getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("renders the title text", () => {
    const { getByText } = render(<CustomLink href="/about" title="About Me" />);

    expect(getByText("About Me")).toBeInTheDocument();
  });
});
