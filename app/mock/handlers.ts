import { http, HttpResponse, passthrough } from "msw";
import { mockArticles } from "../test-utils/mockArticle";

async function getQueryAndParams(request: Request) {
  const url = new URL(request.url);
  let query = url.searchParams.get("query");
  let params: Record<string, string> = {};
  try {
    const body = await request
      .clone()
      .json()
      .catch(() => ({}));
    if (body && typeof body === "object") {
      query = query ?? body.query;
      params = body.params ?? {};
    }
  } catch {
    // GET request or no body
  }
  return { query, params };
}

export const handlers = [
  http.all("*sanity*", async ({ request }) => {
    const { query, params } = await getQueryAndParams(request);

    if (query?.includes('*[_type == "blogPost"] | order(publishedAt desc)')) {
      return HttpResponse.json({ result: mockArticles }, { status: 200 });
    }
    if (query?.includes('*[_type == "blogPost" && slug.current == $slug][0]')) {
      const slug =
        params.slug ?? new URL(request.url).searchParams.get("$slug") ?? "";
      const articleSlug = String(slug).replace(/"/g, "");

      const article = mockArticles.find(
        (item) =>
          item.slug.current.includes(articleSlug) ||
          articleSlug.includes(item.slug.current)
      );

      return HttpResponse.json({ result: article }, { status: 200 });
    }

    return passthrough();
  }),
  http.all("*", async () => {
    return passthrough();
  }),
];
