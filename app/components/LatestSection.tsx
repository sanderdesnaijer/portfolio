import Image from "next/image";
import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { pageSlugs } from "../utils/routes";

export type LatestProjectPreview = Pick<
  ProjectTypeSanity,
  "_id" | "title" | "slug" | "publishedAt" | "tags"
> & {
  imageURL?: string | null;
  imageAlt?: string | null;
};

export type LatestPostPreview = Pick<
  BlogSanity,
  "_id" | "title" | "slug" | "publishedAt" | "tags"
> & {
  imageURL?: string | null;
  imageAlt?: string | null;
};

interface LatestSectionProps {
  projects: LatestProjectPreview[];
  posts: LatestPostPreview[];
  latestProjectsLabel: string;
  latestPostsLabel: string;
}

function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function buildImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("fm", "webp");
    urlObj.searchParams.set("w", "600");
    urlObj.searchParams.set("h", "450");
    urlObj.searchParams.set("fit", "crop");
    urlObj.searchParams.set("crop", "top");
    urlObj.searchParams.set("auto", "format");
    return urlObj.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}fm=webp&w=600&h=450&fit=crop&crop=top&auto=format`;
  }
}

interface LatestItemProps {
  title: string;
  href: string;
  publishedAt: string;
  imageURL?: string | null;
  imageAlt?: string | null;
  priority?: boolean;
}

function LatestItem({
  title,
  href,
  publishedAt,
  imageURL,
  imageAlt,
  priority,
}: LatestItemProps) {
  return (
    <div className="group/latest relative flex flex-col overflow-hidden rounded-md border border-neutral-200 transition-all hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
      {imageURL ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={buildImageUrl(imageURL)}
            alt={imageAlt || title}
            fill
            className="!mt-0 object-cover object-top transition-transform duration-300 group-hover/latest:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-900" />
      )}
      <div className="p-4">
        <p className="relative z-10 mt-0 mb-1 text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          {formatMonthYear(publishedAt)}
        </p>
        <div className="[line-height:1.2]">
          <Link
            href={href}
            className="mt-0 text-base font-normal text-neutral-900 no-underline transition-colors group-hover/latest:underline before:absolute before:inset-0 before:z-0 before:opacity-0 before:content-[''] dark:text-neutral-100"
          >
            {title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const LatestSection = ({
  projects,
  posts,
  latestProjectsLabel,
  latestPostsLabel,
}: LatestSectionProps) => {
  return (
    <section className="mt-12 space-y-8 pb-4 md:mt-16">
      <div>
        <h2 className="mb-4 text-xs font-bold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          {latestProjectsLabel}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((project) =>
            project.slug ? (
              <LatestItem
                key={project._id}
                title={project.title}
                href={`/${pageSlugs.projects}/${project.slug.current}`}
                publishedAt={project.publishedAt}
                imageURL={project.imageURL}
                imageAlt={project.imageAlt}
                priority
              />
            ) : null
          )}
        </div>
      </div>

      <div className="border-neutral-300 pb-6 dark:border-neutral-700">
        <h2 className="mb-4 text-xs font-bold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          {latestPostsLabel}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post, i) =>
            post.slug ? (
              <LatestItem
                key={post._id}
                title={post.title}
                href={`/${pageSlugs.blog}/${post.slug.current}`}
                publishedAt={post.publishedAt}
                imageURL={post.imageURL}
                imageAlt={post.imageAlt}
                priority={i === 0}
              />
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};
