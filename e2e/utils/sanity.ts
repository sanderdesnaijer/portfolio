/**
 * Lightweight Sanity client for e2e tests.
 *
 * Queries Sanity CDN directly instead of going through the app's API routes.
 * This allows the API routes to be removed from production, reducing
 * unnecessary edge requests from bot traffic.
 */
import { createClient } from "@sanity/client";
import {
  blogsQuery,
  blogQuery,
  projectsQuery,
  projectQuery,
  pageQuery,
  settingsQuery,
  jobsQuery,
} from "@/sanity/lib/queries";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import {
  ProjectTypeSanity,
  SettingSanity,
  PageSanity,
  JobSanity,
} from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * Wrapper that catches Sanity/network errors and returns null,
 * matching the behaviour of the removed fetchData helper.
 */
async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[e2e sanity] fetch failed:`, error);
    return null;
  }
}

export async function fetchPage(slug = ""): Promise<PageSanity | null> {
  return safeFetch<PageSanity>(pageQuery, { slug });
}

export async function fetchProjects(): Promise<ProjectTypeSanity[] | null> {
  return safeFetch<ProjectTypeSanity[]>(projectsQuery);
}

export async function fetchProject(
  slug = ""
): Promise<ProjectTypeSanity | null> {
  return safeFetch<ProjectTypeSanity>(projectQuery, { slug });
}

export async function fetchArticles(): Promise<BlogSanity[] | null> {
  return safeFetch<BlogSanity[]>(blogsQuery);
}

export async function fetchArticle(slug: string): Promise<BlogSanity | null> {
  return safeFetch<BlogSanity>(blogQuery, { slug });
}

export async function fetchSettings(): Promise<SettingSanity | null> {
  return safeFetch<SettingSanity>(settingsQuery);
}

export async function fetchJobs(): Promise<JobSanity[] | null> {
  return safeFetch<JobSanity[]>(jobsQuery);
}
