import { http, HttpResponse, passthrough } from "msw";
import pagesFixture from "../../e2e/fixtures/pages.json";
import settingsFixture from "../../e2e/fixtures/settings.json";
import projectsFixture from "../../e2e/fixtures/projects.json";
import blogsFixture from "../../e2e/fixtures/blogs.json";
import jobsFixture from "../../e2e/fixtures/jobs.json";
import tagsFixture from "../../e2e/fixtures/tags.json";

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

function getParam(
  params: Record<string, string>,
  request: Request,
  key: string
): string {
  const raw =
    params[key] ?? new URL(request.url).searchParams.get(`$${key}`) ?? "";
  return String(raw).replace(/"/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pages = pagesFixture as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projects = projectsFixture as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blogs = blogsFixture as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jobs = jobsFixture as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tags = tagsFixture as any[];

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
    if (!query) return passthrough();

    // --- Pages ---
    if (query.includes('_type == "pages"') && query.includes("slug.current")) {
      // Single page by slug (pageQuery)
      const slug = getParam(params, request, "slug");
      const page = pages.find((p) => (p.slug?.current ?? "") === slug);
      return HttpResponse.json({ result: page ?? null }, { status: 200 });
    }
    if (query.includes('_type == "pages"') && query.includes("order")) {
      // All pages (allPagesQuery)
      return HttpResponse.json({ result: pages }, { status: 200 });
    }

    // --- Settings ---
    if (query.includes('_type == "setting"')) {
      return HttpResponse.json({ result: settingsFixture }, { status: 200 });
    }

    // --- Projects ---
    if (
      query.includes('_type == "project"') &&
      query.includes("slug.current == $slug")
    ) {
      // Single project by slug
      const slug = getParam(params, request, "slug");
      const project = projects.find((p) => p.slug?.current === slug);
      return HttpResponse.json({ result: project ?? null }, { status: 200 });
    }
    if (
      query.includes('_type == "project"') &&
      query.includes("slug.current != $currentSlug")
    ) {
      // Related or recent projects (exclude current)
      const currentSlug = getParam(params, request, "currentSlug");
      const filtered = projects.filter((p) => p.slug?.current !== currentSlug);
      return HttpResponse.json(
        { result: filtered.slice(0, 3) },
        { status: 200 }
      );
    }
    if (query.includes('_type == "project"') && query.includes("count(tags)")) {
      // Projects with tags queries
      return HttpResponse.json({ result: projects }, { status: 200 });
    }
    if (query.includes('_type == "project"')) {
      // All projects (projectsQuery, latestProjectsQuery)
      return HttpResponse.json({ result: projects }, { status: 200 });
    }

    // --- Blog posts ---
    if (
      query.includes('_type == "blogPost"') &&
      query.includes("slug.current == $slug")
    ) {
      // Single blog by slug
      const slug = getParam(params, request, "slug");
      const article = blogs.find((b) => b.slug?.current === slug);
      return HttpResponse.json({ result: article ?? null }, { status: 200 });
    }
    if (
      query.includes('_type == "blogPost"') &&
      query.includes("slug.current != $currentSlug")
    ) {
      // Related or recent blogs (exclude current)
      const currentSlug = getParam(params, request, "currentSlug");
      const filtered = blogs.filter((b) => b.slug?.current !== currentSlug);
      return HttpResponse.json(
        { result: filtered.slice(0, 3) },
        { status: 200 }
      );
    }
    if (
      query.includes('_type == "blogPost"') &&
      query.includes("count(tags)")
    ) {
      // Blogs with tags queries
      return HttpResponse.json({ result: blogs }, { status: 200 });
    }
    if (query.includes('_type == "blogPost"')) {
      // All blogs (blogsQuery, latestBlogQuery)
      return HttpResponse.json({ result: blogs }, { status: 200 });
    }

    // --- Jobs ---
    if (query.includes('_type == "job"') && query.includes("count(tags)")) {
      // Jobs with tags queries
      return HttpResponse.json({ result: jobs }, { status: 200 });
    }
    if (query.includes('_type == "job"')) {
      return HttpResponse.json({ result: jobs }, { status: 200 });
    }

    // --- Tags ---
    if (
      query.includes('_type == "tag"') &&
      query.includes("slug.current == $slug")
    ) {
      const slug = getParam(params, request, "slug");
      const tag = tags.find((t) => t.slug?.current === slug);
      return HttpResponse.json({ result: tag ?? null }, { status: 200 });
    }
    if (query.includes('_type == "tag"')) {
      return HttpResponse.json({ result: tags }, { status: 200 });
    }

    // Fallback: pass through (should not happen with complete fixtures)
    // eslint-disable-next-line no-console
    console.warn("[MSW] Unhandled Sanity query:", query?.slice(0, 100));
    return passthrough();
  }),

  http.all("*", async () => {
    return passthrough();
  }),
];
