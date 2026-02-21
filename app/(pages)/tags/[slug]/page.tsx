"use server";

import { NotFound } from "@/app/components/NotFound";
import { PageLayout } from "@/app/components/PageLayout";
import Projects from "@/app/components/Projects";
import { generateMetaData } from "@/app/utils/metadata";
import { buildPageUrl, toTagSlug } from "@/app/utils/utils";
import envConfig from "@/envConfig";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";

type Params = Promise<{ slug: string }>;

const getMatchingTagLabels = (projects: ProjectTypeSanity[], slug: string) => {
  const labels = projects
    .flatMap((project) => project.tags?.map((tag) => tag.label) || [])
    .filter((label): label is string => Boolean(label?.trim()));

  return Array.from(new Set(labels)).filter(
    (label) => toTagSlug(label) === slug
  );
};

export async function generateStaticParams() {
  const projects = await client.fetch<{ tags?: { label: string }[] }[]>(
    `*[_type == "project"]{ "tags": tags[]->{ label } }`
  );

  const slugs = projects
    .flatMap(
      (project) => project.tags?.map((tag) => toTagSlug(tag.label)) || []
    )
    .filter(Boolean);

  return Array.from(new Set(slugs)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const projects = await sanityFetch<ProjectTypeSanity[]>({
    query: projectsQuery,
  });
  const labels = getMatchingTagLabels(projects, slug);
  const label = labels[0];

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

  const title = `${label} Projects`;
  const description = `Portfolio projects tagged with ${label}.`;
  const filteredProjects = projects.filter((project) =>
    project.tags?.some((tag) => labels.includes(tag.label))
  );

  const keywords = [
    `${label} developer portfolio`,
    `indie developer ${label} apps`,
    label,
  ];

  return generateMetaData({
    title,
    description,
    url: buildPageUrl("tags", slug),
    publishedTime:
      filteredProjects.at(-1)?._createdAt || new Date().toISOString(),
    modifiedTime: filteredProjects[0]?._updatedAt || new Date().toISOString(),
    imageUrl: `${envConfig.baseUrl}/meta/light/apple-icon@3x.png`,
    keywords,
  });
}

const TagsPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const [projects, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({ query: projectsQuery }),
    getTranslations(),
  ]);

  const labels = getMatchingTagLabels(projects, slug);
  const label = labels[0];

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

  const taggedProjects = projects.filter((project) =>
    project.tags?.some((tag) => labels.includes(tag.label))
  );

  return (
    <PageLayout title={label}>
      <Projects projects={taggedProjects} pageSlug="projects" />
    </PageLayout>
  );
};

export default TagsPage;
