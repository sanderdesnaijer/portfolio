"use server";
import { Layout } from "@/app/components/Layout";
import { NotFound } from "@/app/components/NotFound";
import Projects from "@/app/components/Projects";
import { generatePageMetadata } from "@/app/utils/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { getTranslations } from "next-intl/server";

const slug = "projects";

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

  const title = page ? page.title : t("error.404.generic.title");

  return (
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
          href={`${process.env.NEXT_PUBLIC_BASE_URL}` || `/`}
        />
      )}
    </Layout>
  );
}
