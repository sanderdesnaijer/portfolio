/**
 * @jest-environment node
 */
import { mockArticles } from "@/app/test-utils/mockArticle";
import { fetchMediumArticles } from "./utils";
import { mswServer } from "@/app/mock/mswServer";
import { http, HttpResponse } from "msw";

describe("fetchMediumArticles", () => {
  it("should return articles when the fetch is successful", async () => {
    const articles = await fetchMediumArticles();
    expect(articles).toEqual(mockArticles);
  });

  it("should return an empty array when the fetch fails", async () => {
    mswServer.use(
      http.all("*/api.rss2json*", async () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const articles = await fetchMediumArticles();
    expect(articles).toEqual([]);
  });

  it("should return an empty array when an error is thrown", async () => {
    mswServer.use(
      http.all("*/api.rss2json*", async () => {
        throw new HttpResponse(null, { status: 400 });
      })
    );

    const articles = await fetchMediumArticles();
    expect(articles).toEqual([]);
  });
});
