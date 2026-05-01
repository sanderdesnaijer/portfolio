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

// 1x1 transparent PNG placeholder for mock image requests
const PLACEHOLDER_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function decodeBase64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(base64, "base64"));
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const PLACEHOLDER_PNG = decodeBase64ToBytes(PLACEHOLDER_PNG_BASE64);

export const handlers = [
  // Intercept Sanity CDN image requests to prevent "upstream image response failed" noise
  http.get("https://cdn.sanity.io/images/*", () => {
    return new HttpResponse(PLACEHOLDER_PNG, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  }),

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
