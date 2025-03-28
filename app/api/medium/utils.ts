import { REVALIDATE_INTERVAL } from "@/app/utils/constants";
import { MediumArticle } from "./types";
import { mockArticles } from "@/app/test-utils/mockArticle";
import envConfig from "@/envConfig";

export async function fetchMediumArticles(): Promise<MediumArticle[]> {
  if (process.env.NODE_ENV === "development") {
    return mockArticles;
  }

  try {
    const response = await fetch(
      `${envConfig.rssApiUrl}?rss_url=${envConfig.mediumUrl}`,
      {
        next: { revalidate: REVALIDATE_INTERVAL },
      }
    );
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
