"use server";
import { QueryParams } from "@sanity/client";
import { projectQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity } from "@/sanity/types";
import Project from "@/app/components/Project";
import { Tags } from "@/app/components/Tags";
import { generatePageMetadata } from "@/app/utils/metadata";
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
        <>
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:my-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {title}
          </h1>
          <div className="relative flex-1 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-0 md:pb-6 dark:after:bg-white">
            <Project project={project} />
            {project && project.tags && <Tags tags={project.tags} />}
          </div>
        </>
      ) : (
        <NotFound
          title={t("error.404.project.action")}
          description={t("error.404.project.description")}
          href={buildPageUrl(slug)}
        />
      )}
    </>
  );
};

export default ProductPage;
