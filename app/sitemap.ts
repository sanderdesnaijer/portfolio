import { sanityFetch } from "@/sanity/lib/fetch";
import { allPagesQuery, blogsQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { MetadataRoute } from "next";
import envConfig from "@/envConfig";
import { BlogSanity } from "@/sanity/types/blogType";
import { toTagSlug } from "./utils/utils";

const formatDate = (date: string) =>
  new Date(date).toISOString().replace(".000", "");

const getPageSlug = (page?: PageSanity) => page?.slug?.current ?? "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { baseUrl } = envConfig;

  const [pages, projects, articles] = await Promise.all([
    sanityFetch<PageSanity[]>({ query: allPagesQuery }),
    sanityFetch<ProjectTypeSanity[]>({ query: projectsQuery }),
    sanityFetch<BlogSanity[]>({ query: blogsQuery }),
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
    url: `${baseUrl}/${projectsPageSlug}/${page.slug.current}`,
    lastModified: formatDate(page._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPageSlug = getPageSlug(pages.find((page) => page.name === "blog"));
  const blogPages = articles.map((page) => ({
    url: `${baseUrl}/${blogPageSlug}/${page.slug.current}`,
    lastModified: formatDate(page.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tagLastMod = new Map<string, number>();
  const trackTag = (slug: string, date?: string) => {
    if (!slug || !date) return;
    const ts = Date.parse(date);
    if (Number.isNaN(ts)) return;
    const prev = tagLastMod.get(slug);
    if (prev === undefined || ts > prev) tagLastMod.set(slug, ts);
  };
  for (const project of projects) {
    for (const tag of project.tags ?? []) {
      trackTag(toTagSlug(tag.label), project._updatedAt);
    }
  }
  for (const article of articles) {
    for (const tag of article.tags ?? []) {
      trackTag(toTagSlug(tag.label), article._updatedAt ?? article.publishedAt);
    }
  }

  const tagPages = Array.from(tagLastMod.entries()).map(([slug, ts]) => ({
    url: `${baseUrl}/tags/${slug}`,
    lastModified: formatDate(new Date(ts).toISOString()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tagsIndexTs = Array.from(tagLastMod.values()).reduce(
    (max, ts) => (ts > max ? ts : max),
    0
  );
  const tagsIndexPage = {
    url: `${baseUrl}/tags`,
    lastModified: formatDate(
      tagsIndexTs ? new Date(tagsIndexTs).toISOString() : new Date().toISOString()
    ),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  };

  return [
    ...mainPages,
    ...projectsPages,
    ...blogPages,
    tagsIndexPage,
    ...tagPages,
  ];
}
