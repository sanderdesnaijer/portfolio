"use server";

import { PageLayout } from "@/app/components/PageLayout";
import { generatePageMetadata } from "@/app/utils/metadata";
import { toTagSlug } from "@/app/utils/utils";
import { buildBreadcrumbList } from "@/app/utils/breadcrumb";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  blogsWithTagsQuery,
  jobsWithTagsQuery,
  pageQuery,
  projectsWithTagsQuery,
} from "@/sanity/lib/queries";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { pageSlugs } from "@/app/utils/routes";
import { JsonLd } from "@/app/components/JsonLd";
import { PageSanity } from "@/sanity/types";

type TagItem = {
  tags?: { _id: string; label: string }[];
};

type AggregatedTag = {
  label: string;
  slug: string;
  count: number;
};

function aggregateTags(items: TagItem[]): AggregatedTag[] {
  const tagMap = new Map<string, { label: string; count: number }>();

  for (const item of items) {
    if (!item.tags) continue;
    for (const tag of item.tags) {
      if (!tag.label?.trim()) continue;
      const slug = toTagSlug(tag.label);
      if (!slug) continue;
      const existing = tagMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, { label: tag.label, count: 1 });
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, { label, count }]) => ({ label, slug, count }))
    .sort((a, b) => b.count - a.count);
}

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: pageSlugs.tags });
}

export default async function TagsIndexPage() {
  const [allProjects, allBlogs, allJobs, page, t] = await Promise.all([
    sanityFetch<TagItem[]>({ query: projectsWithTagsQuery }),
    sanityFetch<TagItem[]>({ query: blogsWithTagsQuery }),
    sanityFetch<TagItem[]>({ query: jobsWithTagsQuery }),
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug: pageSlugs.tags },
    }),
    getTranslations(),
  ]);

  const tags = aggregateTags([...allProjects, ...allBlogs, ...allJobs]);
  const breadcrumbJsonLd = buildBreadcrumbList({ type: "tag" });
  const title = page?.title ?? t("pages.tags.label");

  return (
    <>
      <JsonLd value={breadcrumbJsonLd} />
      <PageLayout title={title}>
        <p className="mt-4 text-lg leading-8">{t("pages.tags.description")}</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 pl-0 sm:grid-cols-3">
          {tags.map(({ label, slug, count }) => (
            <li key={slug} className="mt-0 list-none pl-0">
              <Link
                href={`/${pageSlugs.tags}/${slug}`}
                className="block rounded border border-current px-4 py-3 text-center text-base font-bold no-underline hover:underline"
              >
                {`${label} (${count})`}
              </Link>
            </li>
          ))}
        </ul>
      </PageLayout>
    </>
  );
}
