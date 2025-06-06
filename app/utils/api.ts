import { QueryParams } from "next-sanity";
import { REVALIDATE_INTERVAL } from "./constants";
import {
  JobSanity,
  PageSanity,
  ProjectTypeSanity,
  SettingSanity,
} from "@/sanity/types";
import envConfig from "@/envConfig";

const { baseUrl } = envConfig;

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

    if (res.status === 404) {
      return null;
    }

    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// following routes are currently only used in e2e test
export async function fetchPage(slug = ""): Promise<PageSanity | null> {
  return fetchData<PageSanity>("/api/page", { slug });
}

export async function fetchProjects(): Promise<ProjectTypeSanity[] | null> {
  return fetchData<ProjectTypeSanity[]>("/api/projects");
}

export async function fetchProject(
  slug = ""
): Promise<ProjectTypeSanity | null> {
  return fetchData<ProjectTypeSanity>(`/api/projects/${slug}`);
}

export async function fetchSettings(): Promise<SettingSanity | null> {
  return fetchData<SettingSanity>("/api/settings");
}

export async function fetchJobs(): Promise<JobSanity | null> {
  return fetchData<JobSanity>("/api/jobs");
}
