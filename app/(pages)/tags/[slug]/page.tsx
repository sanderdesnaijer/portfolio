"use server";

import { NotFound } from "@/app/components/NotFound";
import { PageLayout } from "@/app/components/PageLayout";
import Projects from "@/app/components/Projects";
import { generateMetaData } from "@/app/utils/metadata";
import { buildPageUrl, toTagSlug } from "@/app/utils/utils";
import envConfig from "@/envConfig";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { blogsQuery, projectsQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { getExcerpt } from "@/app/utils/blogUtils";
import { pageSlugs } from "@/app/utils/routes";
import { getTranslations } from "next-intl/server";

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
  const [projects, blogs] = await Promise.all([
    client.fetch<{ tags?: { label: string }[] }[]>(
      `*[_type == "project"]{ "tags": tags[]->{ label } }`
    ),
    client.fetch<{ tags?: { label: string }[] }[]>(
      `*[_type == "blogPost"]{ "tags": tags[]->{ label } }`
    ),
  ]);

  const slugs = [...projects, ...blogs]
    .flatMap((item) => item.tags?.map((tag) => toTagSlug(tag.label)) || [])
    .filter(Boolean);

  return Array.from(new Set(slugs)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const [projects, blogs] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({ query: projectsQuery }),
    sanityFetch<BlogSanity[]>({ query: blogsQuery }),
  ]);

  const projectLabels = getMatchingTagLabels(projects, slug);
  const blogLabels = getMatchingTagLabels(blogs, slug);
  const label = projectLabels[0] || blogLabels[0];

  if (!label) {
    const t = await getTranslations();
    return {
      title: t("error.404.generic.title"),
      description: t("error.404.generic.description"),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const allLabels = Array.from(new Set([...projectLabels, ...blogLabels]));
  const filteredProjects = projects.filter((project) =>
    project.tags?.some((tag) => allLabels.includes(tag.label))
  );
  const filteredBlogs = blogs.filter((blog) =>
    blog.tags?.some((tag) => allLabels.includes(tag.label))
  );
  const allItems = [...filteredProjects, ...filteredBlogs];
  const fallbackTimestamp = new Date().toISOString();
  const publishedTime = getEarliestIsoDate(
    allItems.map((item) => item._createdAt),
    fallbackTimestamp
  );
  const modifiedTime = getLatestIsoDate(
    allItems.map((item) => item._updatedAt),
    fallbackTimestamp
  );

  const title = `${label} Projects & Articles`;
  const description = `Portfolio projects and articles tagged with ${label}.`;
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
    imageUrl: `${envConfig.baseUrl}/meta/light/apple-icon@3x.png`,
    keywords,
  });
}

const TagsPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const [projects, blogs, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({ query: projectsQuery }),
    sanityFetch<BlogSanity[]>({ query: blogsQuery }),
    getTranslations(),
  ]);

  const projectLabels = getMatchingTagLabels(projects, slug);
  const blogLabels = getMatchingTagLabels(blogs, slug);
  const label = projectLabels[0] || blogLabels[0];

  if (!label) {
    return (
      <NotFound
        title={t("error.404.generic.title")}
        description={t("error.404.generic.description")}
        action={t("error.404.generic.action")}
        href={envConfig.baseUrl}
      />
    );
  }

  const allLabels = Array.from(new Set([...projectLabels, ...blogLabels]));

  const taggedProjects = projects.filter((project) =>
    project.tags?.some((tag) => allLabels.includes(tag.label))
  );
  const taggedBlogs = blogs.filter((blog) =>
    blog.tags?.some((tag) => allLabels.includes(tag.label))
  );

  return (
    <PageLayout title={label}>
      {taggedProjects.length > 0 && (
        <Projects projects={taggedProjects} pageSlug={pageSlugs.projects} />
      )}
      {taggedBlogs.length > 0 && (
        <div className="mx-auto md:pt-10">
          <ol
            aria-label={t("pages.blog.articles")}
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
              />
            ))}
          </ol>
        </div>
      )}
    </PageLayout>
  );
};

export default TagsPage;
