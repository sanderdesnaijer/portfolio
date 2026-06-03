/**
 * Fixture-based data provider for e2e tests.
 *
 * Reads from e2e/fixtures/*.json (snapshotted from Sanity production data)
 * instead of querying the Sanity API at runtime. This makes e2e tests:
 * - Fully offline (no network dependency)
 * - Deterministic (same data every run)
 * - Fast (no API round-trips)
 * - Free of Sanity API usage
 *
 * To update fixtures: npx tsx e2e/scripts/snapshot-fixtures.ts
 */
import pagesFixture from "../fixtures/pages.json";
import settingsFixture from "../fixtures/settings.json";
import projectsFixture from "../fixtures/projects.json";
import blogsFixture from "../fixtures/blogs.json";
import jobsFixture from "../fixtures/jobs.json";

import {
  ProjectTypeSanity,
  SettingSanity,
  PageSanity,
  JobSanity,
} from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";

const pages = pagesFixture as unknown as PageSanity[];
const settings = settingsFixture as unknown as SettingSanity;
const projects = projectsFixture as unknown as ProjectTypeSanity[];
const blogs = blogsFixture as unknown as BlogSanity[];
const jobs = jobsFixture as unknown as JobSanity[];

export async function fetchPage(slug = ""): Promise<PageSanity | null> {
  return pages.find((p) => (p.slug?.current ?? "") === slug) ?? null;
}

export async function fetchProjects(): Promise<ProjectTypeSanity[] | null> {
  return projects;
}

export async function fetchProject(
  slug = ""
): Promise<ProjectTypeSanity | null> {
  return projects.find((p) => p.slug?.current === slug) ?? null;
}

export async function fetchArticles(): Promise<BlogSanity[] | null> {
  return blogs;
}

export async function fetchArticle(slug: string): Promise<BlogSanity | null> {
  return blogs.find((b) => b.slug?.current === slug) ?? null;
}

export async function fetchSettings(): Promise<SettingSanity | null> {
  return settings;
}

export async function fetchJobs(): Promise<JobSanity[] | null> {
  return jobs;
}
