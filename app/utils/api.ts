import { QueryParams } from "next-sanity";
import { MediumArticle } from "../api/medium/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const revalidate = 3600;

export async function getMediumArticles(): Promise<MediumArticle[]> {
  return await fetch(`${baseUrl}/api/medium`, {
    next: { revalidate },
  }).then((data) => data.json());
}

export async function getMediumArticle(
  params: QueryParams
): Promise<MediumArticle> {
  return await fetch(`${baseUrl}/api/medium/${params.slug}`, {
    next: { revalidate },
  }).then((data) => data.json());
}
