import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { pageSlugs } from "../utils/routes";

type ProjectPreview = Pick<
  ProjectTypeSanity,
  "_id" | "title" | "slug" | "publishedAt" | "tags"
>;

interface LatestSectionProps {
  projects: ProjectPreview[];
  post: Pick<
    BlogSanity,
    "_id" | "title" | "slug" | "publishedAt" | "categories"
  > | null;
  latestProjectsLabel: string;
  latestPostLabel: string;
}

function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function ProjectItem({ project }: { project: ProjectPreview }) {
  if (!project?.slug) return null;
  return (
    <Link
      href={`/${pageSlugs.projects}/${project.slug.current}`}
      className="group/latest block no-underline"
    >
      <span className="mt-1 block text-lg font-normal text-neutral-900 transition-colors group-hover/latest:underline dark:text-neutral-100">
        {project.title}
      </span>
      <span className="text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {formatMonthYear(project.publishedAt)}
        {project.tags?.length ? (
          <>
            {" · "}
            {project.tags.map((t) => t.label).join(", ")}
          </>
        ) : null}
      </span>
    </Link>
  );
}

export const LatestSection = ({
  projects,
  post,
  latestProjectsLabel,
  latestPostLabel,
}: LatestSectionProps) => {
  const [firstProject, secondProject] = projects;

  return (
    <section className="mt-12 grid grid-cols-1 pb-4 md:mt-16 md:grid-cols-3">
      <div className="pb-8 md:pr-8 md:pb-0">
        <h2 className="mb-0 text-xs font-bold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          {latestProjectsLabel}
        </h2>
        {firstProject && <ProjectItem project={firstProject} />}
      </div>

      <div className="pb-8 md:pt-[18px] md:pr-8 md:pb-0">
        {secondProject && <ProjectItem project={secondProject} />}
      </div>

      <div className="border-t border-neutral-300 pt-8 md:border-t-0 md:pt-0 md:pl-8 dark:border-neutral-700">
        <h2 className="mb-0 text-xs font-bold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          {latestPostLabel}
        </h2>
        {post?.slug && (
          <Link
            href={`/${pageSlugs.blog}/${post.slug.current}`}
            className="group/latest block no-underline"
          >
            <span className="mt-1 block text-lg font-normal text-neutral-900 transition-colors group-hover/latest:underline dark:text-neutral-100">
              {post.title}
            </span>
            <span className="text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {formatMonthYear(post.publishedAt)}
              {post.categories?.length ? (
                <>
                  {" · "}
                  {post.categories.join(", ")}
                </>
              ) : null}
            </span>
          </Link>
        )}
      </div>
    </section>
  );
};
