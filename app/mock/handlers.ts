import { http, HttpResponse, passthrough } from "msw";
import { mockArticles } from "../test-utils/mockArticle";

export const handlers = [
  http.get("*/api/medium", async () => {
    return HttpResponse.json(mockArticles);
  }),
  http.get("*/api/medium/*", async ({ params }) => {
    const articleSlug = params[1] as string;
    const article = mockArticles.find((item) =>
      item.link.includes(articleSlug)
    );
    if (!article) {
      return HttpResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return HttpResponse.json(article);
  }),
  http.all("*/api.rss2json*", async () => {
    return HttpResponse.json({ items: mockArticles });
  }),
  http.all("https://www.google-analytics.com/*", () => {
    console.log("Mock GA Event:");
    return HttpResponse.json({ status: "success" });
  }),
  // http.all("*sanity*", async ({ request }) => {
  //   const url = new URL(request.url);
  //   const query = url.searchParams.get("query");

  //   if (query?.includes('*[_type == "pages"] | order(order asc)')) {
  //     return HttpResponse.json({ result: mockPages });
  //   }

  //   return passthrough();
  // }),
  http.all("*", async ({ request }) => {
    console.log(request.url);
    return passthrough();
  }),
];
