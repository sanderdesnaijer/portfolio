"use server";

import { NotFound } from "@/app/components/NotFound";
import { PageLayout } from "@/app/components/PageLayout";
import { generateMetaData } from "@/app/utils/metadata";
import {
  buildPageUrl,
  generateContentTitle,
  toTagSlug,
  truncateText,
} from "@/app/utils/utils";
import { toPlainText } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  blogsWithTagsFullQuery,
  blogsWithTagsQuery,
  jobsWithTagsFullQuery,
  jobsWithTagsQuery,
  projectsWithTagsFullQuery,
  projectsWithTagsQuery,
  settingsQuery,
  tagBySlugQuery,
} from "@/sanity/lib/queries";
import { ProjectTypeSanity, SettingSanity, TagSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { JobSanity } from "@/sanity/types/jobType";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { ExperienceListItem } from "@/app/components/ExperienceListItem";
import { getExcerpt } from "@/app/utils/blogUtils";
import { pageSlugs } from "@/app/utils/routes";
import { getTranslations } from "next-intl/server";
import { buildBreadcrumbList } from "@/app/utils/breadcrumb";
import { JsonLd } from "@/app/components/JsonLd";

type Params = Promise<{ slug: string }>;

const getEarliestIsoDate = (dates: string[], fallback: string) => {
  const earliestTimestamp = dates.reduce<number | null>((earliest, date) => {
    const timestamp = Date.parse(date);

    if (Number.isNaN(timestamp)) {
      return earliest;
    }

    if (earliest === null) {
      return timestamp;
    }

    return Math.min(earliest, timestamp);
  }, null);

  return earliestTimestamp === null
    ? fallback
    : new Date(earliestTimestamp).toISOString();
};

const getLatestIsoDate = (dates: string[], fallback: string) => {
  const latestTimestamp = dates.reduce<number | null>((latest, date) => {
    const timestamp = Date.parse(date);

    if (Number.isNaN(timestamp)) {
      return latest;
    }

    if (latest === null) {
      return timestamp;
    }

    return Math.max(latest, timestamp);
  }, null);

  return latestTimestamp === null
    ? fallback
    : new Date(latestTimestamp).toISOString();
};

const filterByTagSlug = <T extends { tags?: { label: string }[] }>(
  items: T[],
  slug: string
): T[] =>
  items.filter((item) =>
    item.tags?.some((tag) => toTagSlug(tag.label) === slug)
  );

const getMatchingTagLabels = (
  items: { tags?: { label: string }[] }[],
  slug: string
) => {
  const labels = items
    .flatMap((item) => item.tags?.map((tag) => tag.label) || [])
    .filter((label): label is string => Boolean(label?.trim()));

  return Array.from(new Set(labels)).filter(
    (label) => toTagSlug(label) === slug
  );
};

export async function generateStaticParams() {
  const [projects, blogs, jobs] = await Promise.all([
    client.fetch<{ tags?: { label: string }[] }[]>(
      `*[_type == "project"]{ "tags": tags[]->{ label } }`
    ),
    client.fetch<{ tags?: { label: string }[] }[]>(
      `*[_type == "blogPost"]{ "tags": tags[]->{ label } }`
    ),
    client.fetch<{ tags?: { label: string }[] }[]>(
      `*[_type == "job"]{ "tags": tags[]->{ label } }`
    ),
  ]);

  const slugs = [...projects, ...blogs, ...jobs]
    .flatMap((item) => item.tags?.map((tag) => toTagSlug(tag.label)) || [])
    .filter(Boolean);

  return Array.from(new Set(slugs)).map((slug) => ({ slug }));
}

type TagSlugMetaItem = {
  _createdAt: string;
  _updatedAt: string;
  tags?: { _id: string; label: string }[];
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const [allProjects, allBlogs, allJobs, setting, tag] = await Promise.all([
    sanityFetch<TagSlugMetaItem[]>({
      query: projectsWithTagsQuery,
    }),
    sanityFetch<TagSlugMetaItem[]>({
      query: blogsWithTagsQuery,
    }),
    sanityFetch<TagSlugMetaItem[]>({
      query: jobsWithTagsQuery,
    }),
    sanityFetch<SettingSanity>({ query: settingsQuery }),
    sanityFetch<TagSanity | null>({
      query: tagBySlugQuery,
      params: { slug },
    }),
  ]);

  const projects = filterByTagSlug(allProjects, slug);
  const blogs = filterByTagSlug(allBlogs, slug);
  const jobs = filterByTagSlug(allJobs, slug);

  const projectLabels = getMatchingTagLabels(projects, slug);
  const blogLabels = getMatchingTagLabels(blogs, slug);
  const jobLabels = getMatchingTagLabels(jobs, slug);
  const label = tag?.label || projectLabels[0] || blogLabels[0] || jobLabels[0];

  if (!label) {
    const t = await getTranslations();
    return {
      title: t("error.404.tag.title"),
      description: t("error.404.tag.description"),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const allItems = [...projects, ...blogs, ...jobs];
  const fallbackTimestamp = new Date().toISOString();
  const publishedTime = getEarliestIsoDate(
    allItems.map((item) => item._createdAt),
    fallbackTimestamp
  );
  const modifiedTime = getLatestIsoDate(
    allItems.map((item) => item._updatedAt),
    fallbackTimestamp
  );

  const contentTypes = [
    projects.length > 0 && "Projects",
    blogs.length > 0 && "Articles",
    jobs.length > 0 && "Experience",
  ].filter(Boolean);
  const titleSuffix =
    contentTypes.length > 0 ? contentTypes.join(" & ") : "Projects & Articles";
  const title = generateContentTitle(`${label} ${titleSuffix}`);
  const description =
    tag?.metaDescription ??
    `Portfolio ${titleSuffix.toLowerCase()} tagged with ${label}.`;
  const keywords = [
    `${label} developer portfolio`,
    `indie developer ${label} apps`,
    label,
  ];

  return generateMetaData({
    title,
    description,
    url: buildPageUrl("tags", slug),
    publishedTime,
    modifiedTime,
    imageUrl: setting?.imageURL,
    imageAlt: setting?.imageAlt,
    keywords,
  });
}

const TagsPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const [allProjects, allBlogs, allJobs, t, tag] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({
      query: projectsWithTagsFullQuery,
    }),
    sanityFetch<BlogSanity[]>({
      query: blogsWithTagsFullQuery,
    }),
    sanityFetch<JobSanity[]>({
      query: jobsWithTagsFullQuery,
    }),
    getTranslations(),
    sanityFetch<TagSanity | null>({
      query: tagBySlugQuery,
      params: { slug },
    }),
  ]);

  const taggedProjects = filterByTagSlug(allProjects, slug);
  const taggedBlogs = filterByTagSlug(allBlogs, slug);
  const taggedJobs = filterByTagSlug(allJobs, slug);

  const label =
    tag?.label ||
    taggedProjects[0]?.tags?.find((t) => toTagSlug(t.label) === slug)?.label ||
    taggedBlogs[0]?.tags?.find((t) => toTagSlug(t.label) === slug)?.label ||
    taggedJobs[0]?.tags?.find((t) => toTagSlug(t.label) === slug)?.label;

  if (!label) {
    return (
      <NotFound
        title={t("error.404.tag.title")}
        description={t("error.404.tag.description")}
        action={t("error.404.tag.action")}
        href="/tags"
      />
    );
  }

  const intro = tag?.intro;
  const breadcrumbJsonLd = buildBreadcrumbList({
    type: "tag",
    slug,
    title: label,
  });

  return (
    <>
      <JsonLd value={breadcrumbJsonLd} />
      <PageLayout title={label}>
        {intro && <p className="mt-4 text-lg leading-8">{intro}</p>}
        {taggedProjects.length > 0 && (
          <div className="mx-auto">
            <h2 className="mb-4 text-2xl font-normal">
              {t("pages.tags.tagProjects", { label })}
            </h2>
            <ol
              aria-label={t("pages.tags.tagProjects", { label })}
              className="group mt-0 grid gap-10 pl-0"
            >
              {taggedProjects.map((project, index) => {
                const body =
                  project?.body && project?.body.length
                    ? truncateText(toPlainText(project.body), 200)
                    : null;

                return (
                  <ProjectListItem
                    key={project._id}
                    href={`/${pageSlugs.projects}/${project.slug.current}`}
                    date={project.publishedAt}
                    imageURL={project.imageURL}
                    imageALT={project.mainImage?.alt}
                    title={project.title}
                    tags={project.tags}
                    body={body}
                    index={index}
                    headingLevel="h3"
                  />
                );
              })}
            </ol>
          </div>
        )}
        {taggedBlogs.length > 0 && (
          <div className="mx-auto">
            <h2 className="mb-4 text-2xl font-normal">
              {t("pages.tags.tagArticles", { label })}
            </h2>
            <ol
              aria-label={t("pages.tags.tagArticles", { label })}
              className="group mt-0 grid gap-10 pl-0"
            >
              {taggedBlogs.map((article, index) => (
                <ProjectListItem
                  key={article._id}
                  href={`/${pageSlugs.blog}/${article.slug.current}`}
                  imageURL={article.imageURL}
                  imageALT={article.title}
                  date={article.publishedAt}
                  title={article.title}
                  body={getExcerpt(article)}
                  tags={article.tags}
                  index={index}
                  headingLevel="h3"
                />
              ))}
            </ol>
          </div>
        )}
        {taggedJobs.length > 0 && (
          <div className="mx-auto">
            <h2 className="mb-4 text-2xl font-normal">
              {t("pages.tags.tagExperience", { label })}
            </h2>
            <ul
              aria-label={t("pages.tags.experience")}
              className="mt-0 divide-y divide-gray-100 pl-0 dark:divide-gray-800"
            >
              {taggedJobs.map((job) => (
                <ExperienceListItem
                  key={job._id}
                  companyName={job.companyName}
                  jobTitle={job.jobTitle}
                  startDate={job.startDate}
                  endDate={job.endDate}
                  link={job.link}
                  imageURL={job.imageURL}
                  presentLabel={t("pages.about.datePresent")}
                />
              ))}
            </ul>
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default TagsPage;
