import { getPathsToRevalidate } from "./route";

describe("getPathsToRevalidate", () => {
  /**
   * sitemap.ts is generated from Sanity data, so any document that owns a URL
   * must also revalidate the sitemap. Without this a newly published post is
   * reachable and linked but missing from /sitemap.xml until the next deploy.
   */
  describe.each([
    ["blogPost", "my-post", "/blog/my-post"],
    ["project", "my-project", "/projects/my-project"],
    ["tag", "my-tag", "/tags/my-tag"],
    ["pages", "about", "/about"],
  ])("%s", (type, slug, detailPath) => {
    it("revalidates the sitemap", () => {
      const paths = getPathsToRevalidate({
        _type: type,
        slug: { current: slug },
      });
      expect(paths).toContain("/sitemap.xml");
    });

    it("revalidates its own detail route", () => {
      const paths = getPathsToRevalidate({
        _type: type,
        slug: { current: slug },
      });
      expect(paths).toContain(detailPath);
    });

    it("returns unique paths", () => {
      const paths = getPathsToRevalidate({
        _type: type,
        slug: { current: slug },
      });
      expect(new Set(paths).size).toBe(paths.length);
    });
  });

  it("omits the detail route when the document has no slug", () => {
    const paths = getPathsToRevalidate({ _type: "blogPost" });
    expect(paths).toContain("/blog");
    expect(paths).toContain("/sitemap.xml");
    expect(paths.some((p) => p.startsWith("/blog/"))).toBe(false);
  });

  it("revalidates the feed for content that appears in it", () => {
    expect(
      getPathsToRevalidate({ _type: "blogPost", slug: { current: "x" } })
    ).toContain("/feed.xml");
  });

  it("falls back to the homepage for an unknown type", () => {
    expect(getPathsToRevalidate({ _type: "somethingElse" })).toEqual(["/"]);
  });

  it("revalidates only the homepage for settings", () => {
    expect(getPathsToRevalidate({ _type: "setting" })).toEqual(["/"]);
  });
});
