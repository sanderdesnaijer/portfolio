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
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { buildPageUrl } from "@/app/utils/utils";
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
  const [project, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity>({
      query: projectQuery,
      params,
    }),
    getTranslations(),
  ]);

  const jsonLd = project ? getProjectScheme(project, slug, true) : null;
  const title = project ? project.title : t("error.404.project.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      {project ? (
        <PageLayout title={title}>
          <Project project={project} />
          {project.tags && <Tags tags={project.tags} />}
          <RelatedProjects
            currentSlug={project.slug.current}
            tags={project.tags?.map((tag) => tag.label) || []}
          />
        </PageLayout>
      ) : (
        <NotFound
          title={title}
          action={t("error.404.project.action")}
          description={t("error.404.project.description")}
          href={buildPageUrl(slug)}
        />
      )}
    </>
  );
};

export default ProductPage;
