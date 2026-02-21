import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  relatedProjectsQuery,
  recentProjectsQuery,
} from "@/sanity/lib/queries";
import { ProjectTypeSanity } from "@/sanity/types";
import { Tags } from "./Tags";
import { pageSlugs } from "../utils/routes";
import { getTranslations } from "next-intl/server";

interface RelatedProjectsProps {
  currentSlug: string;
  tags: string[];
}

type RelatedProject = Pick<
  ProjectTypeSanity,
  "_id" | "title" | "slug" | "publishedAt" | "imageURL" | "imageAlt" | "tags"
>;

function RelatedProjectCard({ project }: { project: RelatedProject }) {
  return (
    <Link
      href={`/${pageSlugs.projects}/${project.slug.current}`}
      className="group/card flex flex-col no-underline transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-sm">
        {project.imageURL && (
          <Image
            src={project.imageURL}
            alt={project.imageAlt || project.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover/card:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <h3 className="mt-2 mb-0 text-base font-bold text-gray-900 group-hover/card:underline dark:text-white">
        {project.title}
      </h3>
      <div className="[&_ul]:mt-2 [&_ul]:mb-0">
        {project.tags && project.tags.length > 0 && (
          <Tags tags={project.tags.slice(0, 3)} context={project.title} />
        )}
      </div>
    </Link>
  );
}

export async function RelatedProjects({
  currentSlug,
  tags,
}: RelatedProjectsProps) {
  const t = await getTranslations("pages.project");

  // First get projects with matching tags
  let relatedProjects = await sanityFetch<RelatedProject[]>({
    query: relatedProjectsQuery,
    params: { currentSlug, tags },
  });

  // If we don't have 3 related projects, fill with recent ones
  if (relatedProjects.length < 3) {
    const excludeIds = relatedProjects.map((p) => p._id);
    const limit = 3 - relatedProjects.length;

    const additionalProjects = await sanityFetch<RelatedProject[]>({
      query: recentProjectsQuery,
      params: { currentSlug, excludeIds, limit },
    });

    relatedProjects = [...relatedProjects, ...additionalProjects];
  }

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-4 border-t border-black pt-4 dark:border-white">
      <h2 className="mt-0 -mb-4 text-lg font-bold">{t("relatedProjects")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedProjects.map((project) => (
          <RelatedProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
