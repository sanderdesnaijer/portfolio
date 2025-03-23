import { QueryParams } from "next-sanity";
import { MediumArticle } from "../api/medium/types";
import { REVALIDATE_INTERVAL } from "./constants";
import { getBaseUrl } from "./routes";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";

const baseUrl = getBaseUrl();

async function fetchData<T>(
  endpoint: string,
  params: QueryParams = {}
): Promise<T | null> {
  const url = new URL(`${baseUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, String(value))
  );

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_INTERVAL },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function getMediumArticles(): Promise<MediumArticle[]> {
  return (await fetchData<MediumArticle[]>("/api/medium")) || [];
}

export async function getMediumArticle(
  params: QueryParams
): Promise<MediumArticle | null> {
  return fetchData<MediumArticle>(`/api/medium/${params.slug}`);
}

export async function fetchPage(slug = ""): Promise<PageSanity | null> {
  return fetchData<PageSanity>("/api/page", { slug });
}

export async function fetchProject(
  slug = ""
): Promise<ProjectTypeSanity | null> {
  return fetchData<ProjectTypeSanity>("/api/project", { slug });
}
