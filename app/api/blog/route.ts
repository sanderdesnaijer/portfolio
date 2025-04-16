import { sanityFetch } from "@/sanity/lib/fetch";
import { blogsQuery } from "@/sanity/lib/queries";
import { BlogSanity } from "@/sanity/types/blogType";
import { NextResponse } from "next/server";

export async function GET() {
  const articles = await sanityFetch<BlogSanity[]>({
    query: blogsQuery,
  });

  return NextResponse.json(articles, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
