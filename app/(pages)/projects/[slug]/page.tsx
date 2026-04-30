"use server";
import { QueryParams } from "@sanity/client";
import { projectQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity } from "@/sanity/types";
import Project from "@/app/components/Project";
import { Tags } from "@/app/components/Tags";
import { RelatedProjects } from "@/app/components/RelatedProjects";
import { generatePageMetadata } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { pageSlugs } from "@/app/utils/routes";
import { getProjectScheme, getVideoScheme } from "@/app/utils/jsonLDSchemes";
import { buildBreadcrumbList } from "@/app/utils/breadcrumb";
import { buildPageUrl, generateContentTitle } from "@/app/utils/utils";
import { JsonLd } from "@/app/components/JsonLd";
import { extractVideoInfo } from "@/app/utils/videoUtils";
import { toPlainText } from "next-sanity";
import { PageLayout } from "@/app/components/PageLayout";
import { client } from "@/sanity/lib/client";

const { projects: slug } = pageSlugs;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "project"]{ "slug": slug }`
  );

  return slugs!.map(({ slug }) => ({ slug: slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });
  const t = await getTranslations();

  if (!project) {
    return {
      title: t("error.404.project.title"),
      description: t("error.404.project.description"),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const metadata = await generatePageMetadata({ pageSlug: slug, project });
  const title = generateContentTitle(project.title);
  return {
    ...metadata,
    title,
    openGraph: { ...metadata.openGraph, title },
    twitter: { ...metadata.twitter, title },
  };
}

const ProductPage = async ({ params }: { params: QueryParams }) => {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });

  if (!project) {
    notFound();
  }

  const jsonLd = getProjectScheme(project, slug, true);
  const breadcrumbJsonLd = buildBreadcrumbList({
    type: "project",
    slug: project.slug.current,
    title: project.title,
  });
  const pageUrl = buildPageUrl(slug, project.slug.current);
  const videos = extractVideoInfo(project.body);
  const projectDescription =
    (project.body && toPlainText(project.body)) || project.title;

  return (
    <>
      <JsonLd value={jsonLd} />
      <JsonLd value={breadcrumbJsonLd} />
      {videos.map((video) => (
        <JsonLd
          key={video.videoId}
          value={getVideoScheme({
            video,
            name: project.title,
            description: projectDescription,
            uploadDate: project.publishedAt || project._createdAt,
            pageUrl,
          })}
        />
      ))}
      <PageLayout title={project.title}>
        <Project project={project} />
        {project.tags && <Tags tags={project.tags} context={project.title} />}
        <RelatedProjects
          currentSlug={project.slug.current}
          tags={project.tags?.map((tag) => tag.label) || []}
        />
      </PageLayout>
    </>
  );
};

export default ProductPage;
