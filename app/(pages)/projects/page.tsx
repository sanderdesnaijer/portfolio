import Projects from "@/app/components/Projects";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery } from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/lib/types";

export default async function Page() {
  const posts = await sanityFetch<ProjectTypeSanity[]>({
    query: projectsQuery,
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">Projects</h1>
        <Projects projects={posts} />
      </main>
    </div>
  );
}
