import { http, HttpResponse, passthrough } from "msw";
import { mockArticles } from "../test-utils/mockArticle";

export const handlers = [
  http.all("*sanity*", async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (query?.includes('*[_type == "blogPost"] | order(publishedAt desc)')) {
      return HttpResponse.json({ result: mockArticles }, { status: 200 });
    }
    if (query?.includes('*[_type == "blogPost" && slug.current == $slug][0]')) {
      const slug = url.searchParams.get("$slug")!;
      const articleSlug = slug?.replace(/"/g, "");

      const article = mockArticles.find((item) =>
        item.mediumUrl.includes(articleSlug)
      );

      return HttpResponse.json({ result: article }, { status: 200 });
    }

    return passthrough();
  }),
  http.all("*", async () => {
    return passthrough();
  }),
];
