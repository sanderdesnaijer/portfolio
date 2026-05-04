"use server";
import { JsonLd } from "@/app/components/JsonLd";
import { NotFound } from "@/app/components/NotFound";
import { PageLayout } from "@/app/components/PageLayout";
import Projects from "@/app/components/Projects";
import { getProjectsScheme } from "@/app/utils/jsonLDSchemes";
import { generatePageMetadata } from "@/app/utils/metadata";
import { pageSlugs } from "@/app/utils/routes";
import { buildBreadcrumbList } from "@/app/utils/breadcrumb";
import envConfig from "@/envConfig";

import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";

const { projects: slug } = pageSlugs;

export async function generateMetadata() {
  const t = await getTranslations();
  return generatePageMetadata({
    pageSlug: slug,
    pageTitle: t("pages.project.title"),
    description: t("pages.project.metaDescription"),
  });
}

export default async function Page() {
  const [projects, page, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({
      query: projectsQuery,
    }),
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug },
    }),
    getTranslations(),
  ]);

  const jsonLd =
    page && projects ? getProjectsScheme({ page, projects }) : null;
  const breadcrumbJsonLd = buildBreadcrumbList({ type: "project" });
  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      <JsonLd value={breadcrumbJsonLd} />

      {projects && page ? (
        <PageLayout title={title}>
          <Projects projects={projects} pageSlug={page.slug.current} />
        </PageLayout>
      ) : (
        <NotFound
          title={title}
          action={t("error.404.generic.action")}
          description={t("error.404.generic.description")}
          href={envConfig.baseUrl}
        />
      )}
    </>
  );
}
