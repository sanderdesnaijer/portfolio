import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const runtime = "nodejs";

/**
 * Sanity webhook handler for on-demand revalidation.
 *
 * Configure in Sanity:
 *   URL:    https://www.sanderdesnaijer.com/api/revalidate
 *   Secret: same value as SANITY_REVALIDATE_SECRET in .env.local
 *   Filter: _type in ["project", "blogPost", "tag", "job", "pages", "setting"]
 */

type SanityWebhookBody = {
  _type: string;
  slug?: { current?: string };
};

// Map Sanity document types to the routes they affect.
function getPathsToRevalidate(body: SanityWebhookBody): string[] {
  const { _type, slug } = body;
  const slugValue = slug?.current;

  switch (_type) {
    case "project":
      return [
        "/",
        "/projects",
        "/tags",
        "/api/projects",
        ...(slugValue ? [`/projects/${slugValue}`, `/api/projects/${slugValue}`] : []),
      ];

    case "blogPost":
      return [
        "/",
        "/blog",
        "/tags",
        "/api/blog",
        ...(slugValue ? [`/blog/${slugValue}`, `/api/blog/${slugValue}`] : []),
      ];

    case "tag":
      return [
        "/tags",
        "/projects",
        "/blog",
        ...(slugValue ? [`/tags/${slugValue}`] : []),
      ];

    case "job":
      return ["/about", "/tags"];

    case "pages":
      return [
        "/",
        "/about",
        "/projects",
        "/blog",
        "/tags",
        ...(slugValue ? [`/${slugValue}`] : []),
      ];

    case "setting":
      return ["/"];

    default:
      // Unknown type: revalidate the homepage as a safe fallback.
      return ["/"];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request: missing _type" },
        { status: 400 }
      );
    }

    const paths = getPathsToRevalidate(body);
    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({
      revalidated: true,
      paths,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
