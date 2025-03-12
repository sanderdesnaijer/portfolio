import { QueryParams } from "next-sanity";
import { MediumArticle } from "../api/medium/types";
import { REVALIDATE_INTERVAL } from "./constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getMediumArticles(): Promise<MediumArticle[]> {
  return await fetch(`${baseUrl}/api/medium`, {
    next: { revalidate: REVALIDATE_INTERVAL },
  }).then((data) => data.json());
}

export async function getMediumArticle(
  params: QueryParams
): Promise<MediumArticle> {
  return await fetch(`${baseUrl}/api/medium/${params.slug}`, {
    next: { revalidate: REVALIDATE_INTERVAL },
  }).then((data) => data.json());
}
