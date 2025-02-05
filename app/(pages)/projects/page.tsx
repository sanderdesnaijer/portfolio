import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import Projects from "@/app/components/Projects";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, projectsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";

const slug = "projects";

export default async function Page() {
  const projects = await sanityFetch<ProjectTypeSanity[]>({
    query: projectsQuery,
  });

  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <Layout title={page.title}>
      <Projects projects={projects} pageSlug={page.slug.current} />
    </Layout>
  );
}
