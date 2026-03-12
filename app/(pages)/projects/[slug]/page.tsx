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
import { getProjectScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
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

  return generatePageMetadata({ pageSlug: slug, project });
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

  return (
    <>
      <JsonLd value={jsonLd} />
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
