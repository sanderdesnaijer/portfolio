import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery } from "@/sanity/lib/queries";
import { JobSanity } from "@/sanity/types";
import { NextResponse } from "next/server";

// Explicitly export the GET method
export async function GET() {
  try {
    const data = await sanityFetch<JobSanity>({ query: jobsQuery });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching setting job:", error);

    return NextResponse.json(
      { error: "Failed to fetch setting job" },
      { status: 500 }
    );
  }
}
