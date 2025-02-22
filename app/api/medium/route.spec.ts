/**
 * @jest-environment node
 */
import { fetchMediumArticles } from "./utils";
import { GET } from "./route";
import { mockArticles } from "@/app/test-utils/mockArticle";

jest.mock("./utils", () => ({
  fetchMediumArticles: jest.fn(),
}));

describe("GET /api/medium", () => {
  it("should return a 200 status with articles", async () => {
    (fetchMediumArticles as jest.Mock).mockResolvedValue(mockArticles);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockArticles);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=600, stale-while-revalidate=300"
    );
  });
});
