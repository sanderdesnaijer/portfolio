import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
  const t = await getTranslations();

  return NextResponse.json({ message: t("api.info") }, { status: 200 });
}
