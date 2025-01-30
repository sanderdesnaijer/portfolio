import { getIcon, icons, iconSize } from "./Icons";
import Github from "../../public/icons/github.svg";
import Article from "../../public/icons/article.svg";
import Download from "../../public/icons/download.svg";
import Demo from "../../public/icons/demo.svg";
import Gitlab from "../../public/icons/gitlab.svg";
import Linkedin from "../../public/icons/linkedin.svg";

describe("Icons component", () => {
  it("should return the correct icon component", () => {
    console.log(getIcon("github"));
    expect(getIcon("github")).toBe(Github);
    expect(getIcon("article")).toBe(Article);
    expect(getIcon("download")).toBe(Download);
    expect(getIcon("demo")).toBe(Demo);
    expect(getIcon("gitlab")).toBe(Gitlab);
    expect(getIcon("linkedin")).toBe(Linkedin);
  });

  it("should return null for an unknown icon", () => {
    expect(getIcon("unknown")).toBeNull();
  });

  it("should have the correct icon size", () => {
    expect(iconSize).toBe(24);
  });

  it("should have the correct list of icons", () => {
    expect(icons).toEqual([
      "article",
      "download",
      "demo",
      "github",
      "gitlab",
      "linkedin",
    ]);
  });
});
