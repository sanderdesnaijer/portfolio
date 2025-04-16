import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { BlogSanity } from "@/sanity/types/blogType";
import { blogQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const article = await sanityFetch<BlogSanity>({
    query: blogQuery,
    params,
  });

  if (!article) {
    const t = await getTranslations();
    return NextResponse.json(
      { message: t("api.medium.notFound") },
      { status: 404 }
    );
  }

  return NextResponse.json(article, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
