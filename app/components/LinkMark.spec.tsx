import { render, screen } from "@testing-library/react";
import { LinkMark } from "./LinkMark";

describe("LinkMark", () => {
  it("opens external https links in a new tab with rel=noopener noreferrer", () => {
    render(
      <LinkMark value={{ href: "https://example.com" }}>external</LinkMark>
    );

    const link = screen.getByRole("link", { name: "external" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders root-relative links without target or rel", () => {
    render(<LinkMark value={{ href: "/about" }}>about</LinkMark>);

    const link = screen.getByRole("link", { name: "about" });
    expect(link).toHaveAttribute("href", "/about");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("renders hash anchors without target or rel", () => {
    render(<LinkMark value={{ href: "#section" }}>section</LinkMark>);

    const link = screen.getByRole("link", { name: "section" });
    expect(link).toHaveAttribute("href", "#section");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("falls back to an empty href and treats it as external when value is missing", () => {
    render(<LinkMark>fallback</LinkMark>);

    const link = screen.getByText("fallback").closest("a")!;
    expect(link).toHaveAttribute("href", "");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
