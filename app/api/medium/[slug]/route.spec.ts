/**
 * @jest-environment node
 */
import { mockArticles } from "@/app/test-utils/mockArticle";
import { GET } from "./route";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { mswServer } from "@/app/mock/mswServer";
import { http, HttpResponse } from "msw";

describe("GET /api/medium", () => {
  it("should return a 200 status with found article", async () => {
    const response = await GET(new Request("http://localhost"), {
      params: {
        slug: "building-my-first-flutter-app-challenges-and-lessons-learned",
      },
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockArticles[0]);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=600, stale-while-revalidate=300"
    );
  });

  it("should return a 404 status with not found message", async () => {
    mswServer.use(
      http.all("*/api.rss2json*", async () => {
        return new HttpResponse(null, { status: 404 });
      })
    );
    const response = await GET(new Request("http://localhost"), {
      params: { slug: "my-not-be-found-article" },
    });
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({
      message: getTranslationKey("api.medium.notFound"),
    });
    expect(response.headers.get("Cache-Control")).toBe(null);
  });
});
