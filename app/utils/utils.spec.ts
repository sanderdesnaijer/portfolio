import { generateTitle, generateContentTitle } from "./utils";
import { AUTHOR_NAME } from "./constants";

jest.mock("../../envConfig", () => ({
  baseUrl: "https://mocked-url.com",
}));

describe("utils/utils", () => {
  describe("generateTitle", () => {
    it("should return only the author name when no page title is provided", () => {
      expect(generateTitle()).toBe(AUTHOR_NAME);
    });

    it("should return brand-first title with page title", () => {
      expect(generateTitle("Blog")).toBe(`${AUTHOR_NAME} | Blog`);
    });

    it("should return brand-first title with page and sub-page title", () => {
      expect(generateTitle("Blog", "My Article")).toBe(
        `${AUTHOR_NAME} | Blog | My Article`
      );
    });
  });

  describe("generateContentTitle", () => {
    it("should return content-first title with brand suffix", () => {
      expect(generateContentTitle("My Article")).toBe(
        `My Article | ${AUTHOR_NAME}`
      );
    });

    it("should work for section names", () => {
      expect(generateContentTitle("Blog")).toBe(`Blog | ${AUTHOR_NAME}`);
    });

    it("should work for project names", () => {
      expect(generateContentTitle("Flutter Tabata Timer")).toBe(
        `Flutter Tabata Timer | ${AUTHOR_NAME}`
      );
    });
  });
});
