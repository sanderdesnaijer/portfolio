import { sanityFetch } from "@/sanity/lib/fetch";
import { projectQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { NextResponse } from "next/server";

// Explicitly export the GET method
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    const data = await sanityFetch<ProjectTypeSanity>({
      query: projectQuery,
      params: { slug },
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching page data:", error);

    return NextResponse.json(
      { error: "Failed to fetch page data" },
      { status: 500 }
    );
  }
}
