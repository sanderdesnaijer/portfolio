import { sanityFetch } from "@/sanity/lib/fetch";
import { allPagesQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import { MetadataRoute } from "next";
import { getMediumArticles } from "./utils/api";
import { getSlug } from "./utils/utils";
import envConfig from "@/envConfig";

const formatDate = (date: string) =>
  new Date(date).toISOString().replace(".000", "");

const getPageSlug = (page?: PageSanity) => page?.slug?.current ?? "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { baseUrl } = envConfig;

  const [pages, projects, articles] = await Promise.all([
    sanityFetch<PageSanity[]>({ query: allPagesQuery }),
    sanityFetch<PageSanity[]>({ query: projectsQuery }),
    getMediumArticles().catch(() => []), // Ensure articles fallback to an empty array
  ]);

  const mainPages = pages.map((page, index) => ({
    url: `${baseUrl}${page.slug ? `/${page.slug.current}` : ""}`,
    lastModified: formatDate(page._updatedAt),
    changeFrequency: "monthly" as const,
    priority: index === 0 ? 1 : 0.9,
  }));

  const projectsPageSlug = getPageSlug(
    pages.find((page) => page.name === "projects")
  );
  const projectsPages = projects.map((page) => ({
    url: `${baseUrl}/${projectsPageSlug}/${page?.slug.current}`,
    lastModified: formatDate(page._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPageSlug = getPageSlug(pages.find((page) => page.name === "blog"));
  const blogPages = articles.map((page) => ({
    url: `${baseUrl}/${blogPageSlug}/${getSlug(page.link)}`,
    lastModified: formatDate(page.pubDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...mainPages, ...projectsPages, ...blogPages];
}
