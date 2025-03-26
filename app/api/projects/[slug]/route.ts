import { sanityFetch } from "@/sanity/lib/fetch";
import { projectQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const queryParams = await context.params;

  try {
    const data = await sanityFetch<ProjectTypeSanity>({
      query: projectQuery,
      params: { slug: queryParams.slug },
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching project data:", error);

    return NextResponse.json(
      { error: "Failed to fetch project data" },
      { status: 500 }
    );
  }
}
