import { REVALIDATE_INTERVAL } from "@/app/utils/constants";
import { PageSanity } from "@/sanity/types";

export async function fetchPageData(slug = ""): Promise<PageSanity | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pageData?slug=${slug}`,
      {
        next: { revalidate: REVALIDATE_INTERVAL },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch page");
    const data = await res.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching page:", error);
    return null;
  }
}
