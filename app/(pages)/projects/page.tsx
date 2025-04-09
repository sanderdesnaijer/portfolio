"use server";
import { JsonLd } from "@/app/components/JsonLd";
import { NotFound } from "@/app/components/NotFound";
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
        <>
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:my-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {title}
          </h1>
          <div className="relative flex-1 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-0 md:pb-6 dark:after:bg-white">
            <Projects projects={projects} pageSlug={page.slug.current} />
          </div>
        </>
      ) : (
        <NotFound
          title={t("error.404.generic.action")}
          description={t("error.404.generic.description")}
          href={envConfig.baseUrl}
        />
      )}
    </>
  );
}
