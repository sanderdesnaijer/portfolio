import { getIcon, icons, iconSize } from "./Icons";
import Missing from "@/app/assets/icons/missing.svg";

describe("Icons component", () => {
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
      "x",
      "youtube",
      "instagram",
      "medium",
    ]);
  });
});
