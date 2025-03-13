/**
 * @jest-environment node
 */
import { mockArticles } from "@/app/test-utils/mockArticle";
import { fetchMediumArticles } from "../utils";
import { GET } from "./route";
import { getTranslationKey } from "@/app/test-utils/i18n";

jest.mock("../utils", () => ({
  fetchMediumArticles: jest.fn(),
}));

describe("GET /api/medium", () => {
  it("should return a 200 status with found article", async () => {
    (fetchMediumArticles as jest.Mock).mockResolvedValue(mockArticles);

    const response = await GET(new Request("http://localhost"), {
      params: { slug: "exploring-the-cosmos-with-a-telescope" },
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockArticles[0]);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=600, stale-while-revalidate=300"
    );
  });

  it("should return a 404 status with not found message", async () => {
    (fetchMediumArticles as jest.Mock).mockResolvedValue(mockArticles);

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
