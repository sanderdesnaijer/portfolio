import { NextResponse } from "next/server";
import { fetchMediumArticles } from "./utils";

// GET handler for /api/medium
export async function GET() {
  const articles = await fetchMediumArticles();

  return NextResponse.json(articles, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
