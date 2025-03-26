import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { SettingSanity } from "@/sanity/types";
import { NextResponse } from "next/server";

// Explicitly export the GET method
export async function GET() {
  try {
    const data = await sanityFetch<SettingSanity>({ query: settingsQuery });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching setting data:", error);

    return NextResponse.json(
      { error: "Failed to fetch setting data" },
      { status: 500 }
    );
  }
}
