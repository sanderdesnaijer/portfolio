import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await sanityFetch<ProjectTypeSanity>({
      query: projectsQuery,
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching projects data:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects data" },
      { status: 500 }
    );
  }
}
