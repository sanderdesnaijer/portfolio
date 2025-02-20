import { MediumArticle } from "./types";

const MEDIUM_URL = process.env.NEXT_PUBLIC_MEDIUM_URL!;
const RSS_API_URL = process.env.NEXT_PUBLIC_RSS_API_URL!;

export async function fetchMediumArticles(): Promise<MediumArticle[]> {
  try {
    const res = await fetch(`${RSS_API_URL}?rss_url=${MEDIUM_URL}`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch Medium articles");
    const data = await res.json();
    return data.items as MediumArticle[];
  } catch (error) {
    console.error("Error fetching Medium articles:", error);
    return [];
  }
}
