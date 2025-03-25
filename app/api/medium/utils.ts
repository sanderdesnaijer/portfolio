import { REVALIDATE_INTERVAL } from "@/app/utils/constants";
import { MediumArticle } from "./types";
import { mockArticles } from "@/app/test-utils/mockArticle";

const MEDIUM_URL = process.env.NEXT_PUBLIC_MEDIUM_URL!;
const RSS_API_URL = process.env.NEXT_PUBLIC_RSS_API_URL!;

export async function fetchMediumArticles(): Promise<MediumArticle[]> {
  if (process.env.NODE_ENV === "development") {
    return mockArticles;
  }

  try {
    const response = await fetch(`${RSS_API_URL}?rss_url=${MEDIUM_URL}`, {
      next: { revalidate: REVALIDATE_INTERVAL }, // Revalidate every 10 minutes
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.items as MediumArticle[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching Medium articles:", error);
    return [];
  }
}
