import { http, HttpResponse, passthrough } from "msw";
import { mockArticles } from "../test-utils/mockArticle";

export const handlers = [
  // medium
  http.get("*/api/medium", async () => {
    return HttpResponse.json(mockArticles);
  }),
  http.get("*/api/medium/*", async ({ params }) => {
    const articleSlug = params[1] as string;
    const article = mockArticles.find((item) =>
      item.link.includes(articleSlug)
    );
    return HttpResponse.json(article);
  }),
  http.all("*/api.rss2json*", async () => {
    return HttpResponse.json({ items: mockArticles });
  }),
  // sanity
  http.all("*", async () => {
    // Pass the request to the real server (or continue normal behavior)
    return passthrough();
  }),
];
