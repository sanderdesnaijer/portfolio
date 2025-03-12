import { NextResponse } from "next/server";
import { fetchMediumArticles } from "../utils";
import { getTranslations } from "next-intl/server";

// GET handler for /api/medium/[id]
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const queryParams = await params;
  const articles = await fetchMediumArticles();
  const article = articles.find((item) => item.link.includes(queryParams.slug));
  const t = await getTranslations();

  if (!article) {
    return NextResponse.json(
      { message: t("api.medium.not-found") },
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
