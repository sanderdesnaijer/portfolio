import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import Projects from "@/app/components/Projects";
import { REVALIDATION_INTERVAL } from "@/app/utils/constants";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, projectsQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity, SettingSanity } from "@/sanity/types";

const slug = "projects";

export const revalidate = REVALIDATION_INTERVAL;

export default async function Page() {
  const projects = await sanityFetch<ProjectTypeSanity[]>({
    query: projectsQuery,
  });
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <Projects projects={projects} pageSlug={page.slug.current} />
    </Layout>
  );
}
