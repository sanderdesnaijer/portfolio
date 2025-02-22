import { mockArticles } from "@/app/test-utils/mockArticle";
import { fetchMediumArticles } from "./utils";

describe("fetchMediumArticles", () => {
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return articles when the fetch is successful", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockArticles }),
    });

    const articles = await fetchMediumArticles();
    expect(articles).toEqual(mockArticles);
  });

  it("should return an empty array when the fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const articles = await fetchMediumArticles();
    expect(articles).toEqual([]);
  });

  it("should return an empty array when an error is thrown", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const articles = await fetchMediumArticles();
    expect(articles).toEqual([]);
  });
});
