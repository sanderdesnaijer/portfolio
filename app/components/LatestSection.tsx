import Image from "next/image";
import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { pageSlugs } from "../utils/routes";
import { toTagSlug } from "../utils/utils";
import ChevronRight from "@/public/icons/chevron-right.svg";

const MAX_TAGS = 3;

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
  viewProjectsLabel: string;
  readArticlesLabel: string;
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
  tags?: { _id: string; label: string }[];
  imageURL?: string | null;
  imageAlt?: string | null;
  priority?: boolean;
}

function LatestItem({
  title,
  href,
  publishedAt,
  tags,
  imageURL,
  imageAlt,
  priority,
}: LatestItemProps) {
  const visibleTags = tags?.slice(0, MAX_TAGS);
  return (
    <div className="group/latest relative flex flex-col overflow-hidden transition-all">
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
          {visibleTags?.length ? (
            <div className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tags/${toTagSlug(tag.label)}`}
                  className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-neutral-900 no-underline shadow-sm ring-1 ring-black/5 backdrop-blur-sm hover:no-underline dark:bg-black/70 dark:text-neutral-100"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-900" />
      )}
      <div className="px-0 pt-3 pb-0">
        <p className="relative z-10 mt-0 mb-1 text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          {formatMonthYear(publishedAt)}
        </p>
        <div className="[line-height:1.2]">
          <Link
            href={href}
            className="mt-0 text-base font-semibold text-neutral-900 no-underline transition-colors group-hover/latest:underline before:absolute before:inset-0 before:z-0 before:opacity-0 before:content-[''] dark:text-neutral-100"
          >
            {title}
          </Link>
        </div>
      </div>
    </div>
  );
}

const ctaLinkClass =
  "group/cta inline-flex shrink-0 items-center gap-1 text-sm font-medium no-underline hover:underline";
const ctaIconClass =
  "h-4 w-4 transition-transform group-hover/cta:translate-x-1";

export const LatestSection = ({
  projects,
  posts,
  latestProjectsLabel,
  latestPostsLabel,
  viewProjectsLabel,
  readArticlesLabel,
}: LatestSectionProps) => {
  return (
    <section className="mt-12 space-y-8 pb-4 md:mt-16">
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {latestProjectsLabel}
          </h2>
          <Link href={`/${pageSlugs.projects}`} className={ctaLinkClass}>
            {viewProjectsLabel}
            <ChevronRight aria-hidden="true" className={ctaIconClass} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((project) =>
            project.slug ? (
              <LatestItem
                key={project._id}
                title={project.title}
                href={`/${pageSlugs.projects}/${project.slug.current}`}
                publishedAt={project.publishedAt}
                tags={project.tags}
                imageURL={project.imageURL}
                imageAlt={project.imageAlt}
                priority
              />
            ) : null
          )}
        </div>
      </div>

      <div className="border-neutral-300 pb-6 dark:border-neutral-700">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {latestPostsLabel}
          </h2>
          <Link href={`/${pageSlugs.blog}`} className={ctaLinkClass}>
            {readArticlesLabel}
            <ChevronRight aria-hidden="true" className={ctaIconClass} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post, i) =>
            post.slug ? (
              <LatestItem
                key={post._id}
                title={post.title}
                href={`/${pageSlugs.blog}/${post.slug.current}`}
                publishedAt={post.publishedAt}
                tags={post.tags}
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
