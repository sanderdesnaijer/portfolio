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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">{page.title}</h1>
        <Projects projects={projects} />
      </main>
    </div>
  );
}
