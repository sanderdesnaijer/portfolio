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
import {
  ProjectTypeSanity,
  SettingSanity,
  PageSanity,
  JobSanity,
} from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-24",
  useCdn: true,
});

export async function fetchPage(slug = ""): Promise<PageSanity | null> {
  return client.fetch<PageSanity | null>(pageQuery, { slug });
}

export async function fetchProjects(): Promise<ProjectTypeSanity[] | null> {
  return client.fetch<ProjectTypeSanity[]>(projectsQuery);
}

export async function fetchProject(
  slug = ""
): Promise<ProjectTypeSanity | null> {
  return client.fetch<ProjectTypeSanity | null>(projectQuery, { slug });
}

export async function fetchArticles(): Promise<BlogSanity[] | null> {
  return client.fetch<BlogSanity[]>(blogsQuery);
}

export async function fetchArticle(slug: string): Promise<BlogSanity | null> {
  return client.fetch<BlogSanity | null>(blogQuery, { slug });
}

export async function fetchSettings(): Promise<SettingSanity | null> {
  return client.fetch<SettingSanity | null>(settingsQuery);
}

export async function fetchJobs(): Promise<JobSanity | null> {
  return client.fetch<JobSanity | null>(jobsQuery);
}
