import { getIcon, icons, iconSize } from "./Icons";
import Github from "../../public/icons/github.svg";
import Article from "../../public/icons/article.svg";
import Download from "../../public/icons/download.svg";
import Demo from "../../public/icons/demo.svg";
import Gitlab from "../../public/icons/gitlab.svg";
import Linkedin from "../../public/icons/linkedin.svg";
import Missing from "../../public/icons/missing.svg";

describe("Icons component", () => {
  it("should return the correct icon component", () => {
    expect(getIcon("github")).toBe(Github);
    expect(getIcon("article")).toBe(Article);
    expect(getIcon("download")).toBe(Download);
    expect(getIcon("demo")).toBe(Demo);
    expect(getIcon("gitlab")).toBe(Gitlab);
    expect(getIcon("linkedin")).toBe(Linkedin);
    expect(getIcon("chevronRight")).toBe(Linkedin);
  });

  it("should return the Missing icon component for an unknown icon", () => {
    expect(getIcon("unknown")).toBe(Missing);
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
      "chevronRight",
    ]);
  });
});
