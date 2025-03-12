"use server";
import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import Projects from "@/app/components/Projects";
import { generatePageMetadata } from "@/app/utils/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";

const slug = "projects";

export const revalidate = 3600;

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

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
      <Projects projects={projects} pageSlug={page.slug.current} />
    </Layout>
  );
}
