"use server";
import { JsonLd } from "@/app/components/JsonLd";
import { Layout } from "@/app/components/Layout";
import { NotFound } from "@/app/components/NotFound";
import Projects from "@/app/components/Projects";
import { getProjectsScheme } from "@/app/utils/jsonLDSchemes";
import { generatePageMetadata } from "@/app/utils/metadata";
import { pageSlugs } from "@/app/utils/routes";
import envConfig from "@/envConfig";

import { sanityFetch } from "@/sanity/lib/fetch";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

const { projects: slug } = pageSlugs;

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
}

export default async function Page() {
  const [projects, page, { setting, menuItems }, t] = await Promise.all([
    sanityFetch<ProjectTypeSanity[]>({
      query: projectsQuery,
    }),
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug },
    }),
    fetchCommonData(),
    getTranslations(),
  ]);

  const jsonLd =
    page && projects ? getProjectsScheme({ page, projects }) : null;

  const title = page ? page.title : t("error.404.generic.title");
  return (
    <Suspense fallback="LOADING">
      {jsonLd && <JsonLd value={jsonLd} />}
      <Layout
        pageTitle={title}
        socialMedia={setting.socialMedia}
        authorName={setting.title}
        menuItems={menuItems}
      >
        {projects && page ? (
          <Projects projects={projects} pageSlug={page.slug.current} />
        ) : (
          <NotFound
            title={t("error.404.generic.action")}
            description={t("error.404.generic.description")}
            href={envConfig.baseUrl}
          />
        )}
      </Layout>
    </Suspense>
  );
}
