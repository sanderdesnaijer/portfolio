"use server";
import { QueryParams } from "@sanity/client";
import { projectQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
import Project from "@/app/components/Project";
import { Tags } from "@/app/components/Tags";
import { generatePageMetadata } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { buildPageUrl } from "@/app/utils/utils";
import { getProjectScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";

const { projects: slug } = pageSlugs;

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
  const [project, { setting, menuItems }, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity>({
      query: projectQuery,
      params,
    }),
    fetchCommonData(),
    getTranslations(),
  ]);

  const jsonLd = project ? getProjectScheme(project, slug, true) : null;

  const title = project ? project.title : t("error.404.project.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      <Layout
        pageTitle={title}
        socialMedia={setting.socialMedia}
        authorName={setting.title}
        menuItems={menuItems}
      >
        {project ? (
          <Project project={project} />
        ) : (
          <NotFound
            title={t("error.404.project.action")}
            description={t("error.404.project.description")}
            href={buildPageUrl(slug)}
          />
        )}
        {project && project.tags && <Tags tags={project.tags} />}
      </Layout>
    </>
  );
};

export default ProductPage;
