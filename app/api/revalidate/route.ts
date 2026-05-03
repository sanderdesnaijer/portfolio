import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type } = body;

    // Revalidate based on content type
    switch (_type) {
      case "blog":
        revalidatePath("/blog", "page");
        if (body.slug?.current) {
          revalidatePath(`/blog/${body.slug.current}`, "page");
        }
        break;
      case "project":
        revalidatePath("/projects", "page");
        if (body.slug?.current) {
          revalidatePath(`/projects/${body.slug.current}`, "page");
        }
        break;
      default:
        // For other content types (pages, settings), revalidate everything
        revalidatePath("/", "layout");
        break;
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
