"use server";
import { JsonLd } from "@/app/components/JsonLd";
import { Layout } from "@/app/components/Layout";
import { NotFound } from "@/app/components/NotFound";
import Projects from "@/app/components/Projects";
import { getProjectsScheme } from "@/app/utils/jsonLDSchemes";
import { generatePageMetadata } from "@/app/utils/metadata";
import { getBaseUrl, pageSlugs } from "@/app/utils/routes";
import { buildPageUrl } from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";
import { toPlainText } from "next-sanity";

const { projects: slug } = pageSlugs;

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
}

export default async function Page() {
  const projects = await sanityFetch<ProjectTypeSanity[]>({
    query: projectsQuery,
  });
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug },
  });
  const { setting, menuItems } = await fetchCommonData();
  const t = await getTranslations();

  const jsonLd =
    page && projects
      ? getProjectsScheme({
          title: page.title,
          url: buildPageUrl(page.slug.current),
          description: page.description,
          projects: projects.map((project) => ({
            title: project.title,
            url: buildPageUrl(page.slug.current, project.slug.current),
            description: project.body && toPlainText(project.body),
            imageUrl: project.imageURL!,
            type: project.jsonLdType,
            applicationCategory: project.jsonLdApplicationCategory,
            operatingSystem: project.jsonLdOperatingSystem,
            codeRepository: project.jsonLdCodeRepository,
            programmingLanguage: project.jsonLdProgrammingLanguage,
          })),
        })
      : null;

  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
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
            href={getBaseUrl()}
          />
        )}
      </Layout>
    </>
  );
}
