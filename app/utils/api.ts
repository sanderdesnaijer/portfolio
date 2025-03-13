import { QueryParams } from "next-sanity";
import { MediumArticle } from "../api/medium/types";
import { REVALIDATE_INTERVAL } from "./constants";
import { getBaseUrl } from "./routes";

const baseUrl = getBaseUrl();

export async function getMediumArticles(): Promise<MediumArticle[]> {
  return await fetch(`${baseUrl}/api/medium`, {
    next: { revalidate: REVALIDATE_INTERVAL },
  }).then((data) => data.json());
}

export async function getMediumArticle(
  params: QueryParams
): Promise<MediumArticle | null> {
  const response = await fetch(`${baseUrl}/api/medium/${params.slug}`, {
    next: { revalidate: REVALIDATE_INTERVAL },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
}
