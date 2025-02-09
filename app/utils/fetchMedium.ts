const MEDIUM_URL = process.env.NEXT_PUBLIC_MEDIUM_URL;
const RSS_API_URL = process.env.NEXT_PUBLIC_RSS_API_URL;

export interface Article {
  author: string;
  categories: string[];
  content: string;
  description: string;
  enclosure: Record<string, unknown>;
  guid: string;
  link: string;
  pubDate: string;
  thumbnail: string | null;
  title: string;
}

export async function fetchMediumArticles(): Promise<Article[]> {
  try {
    const res = await global.fetch(`${RSS_API_URL}?rss_url=${MEDIUM_URL}`);
    if (!res.ok) throw new Error("Failed to fetch Medium articles");

    const data = await res.json();
    return data.items as Article[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching Medium articles:", error);
    return [];
  }
}
