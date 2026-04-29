import { buildPageUrl } from "./utils";
import envConfig from "@/envConfig";

type BreadcrumbType = "blog" | "project" | "tag";

interface BreadcrumbSegment {
  name: string;
  url: string;
}

/**
 * Builds a BreadcrumbList JSON-LD object for search engine rich results.
 *
 * Supports both index pages (2-level: Home > Section) and detail pages
 * (3-level: Home > Section > Item) depending on whether slug and title
 * are provided.
 *
 * Per Google's recommendation, the `item` URL is omitted on the last
 * element since it represents the current page.
 *
 * @param type - The page type: "blog", "project", or "tag".
 * @param slug - Optional. The detail page slug (omit for index pages).
 * @param title - Optional. The detail page title (omit for index pages).
 */
export function buildBreadcrumbList({
  type,
  slug,
  title,
}: {
  type: BreadcrumbType;
  slug?: string;
  title?: string;
}) {
  const home: BreadcrumbSegment = { name: "Home", url: envConfig.baseUrl };

  const sectionMap: Record<BreadcrumbType, BreadcrumbSegment> = {
    blog: { name: "Blog", url: buildPageUrl("blog") },
    project: { name: "Projects", url: buildPageUrl("projects") },
    tag: { name: "Tags", url: buildPageUrl("tags") },
  };

  const segments: BreadcrumbSegment[] = [home, sectionMap[type]];

  if (slug && title) {
    const pathPrefix = type === "project" ? "projects" : type;
    segments.push({
      name: title,
      url: buildPageUrl(pathPrefix, slug),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((seg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: seg.name,
      ...(index < segments.length - 1 && { item: seg.url }),
    })),
  };
}
