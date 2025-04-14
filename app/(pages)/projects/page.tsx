"use server";
import { JsonLd } from "@/app/components/JsonLd";
import { NotFound } from "@/app/components/NotFound";
import { PageLayout } from "@/app/components/PageLayout";
import Projects from "@/app/components/Projects";
import { getProjectsScheme } from "@/app/utils/jsonLDSchemes";
import { generatePageMetadata } from "@/app/utils/metadata";
import { pageSlugs } from "@/app/utils/routes";
import envConfig from "@/envConfig";

import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";

const { projects: slug } = pageSlugs;

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
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
  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}

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
