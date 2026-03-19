import Image from "next/image";
import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { BlogSanity } from "@/sanity/types/blogType";
import { pageSlugs } from "../utils/routes";
import { toTagSlug } from "../utils/utils";

type ProjectPreview = Pick<
  ProjectTypeSanity,
  "_id" | "title" | "slug" | "publishedAt" | "tags"
> & {
  imageURL?: string;
  imageAlt?: string;
};

type PostPreview = Pick<
  BlogSanity,
  "_id" | "title" | "slug" | "publishedAt" | "tags"
> & {
  imageURL?: string;
  imageAlt?: string;
};

interface LatestSectionProps {
  projects: ProjectPreview[];
  posts: PostPreview[];
  latestProjectsLabel: string;
  latestPostsLabel: string;
}

function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function TagLinks({ tags }: { tags: { _id: string; label: string }[] }) {
  return (
    <>
      {" · "}
      {tags.map((tag, i) => (
        <span key={tag._id}>
          <Link
            href={`/tags/${toTagSlug(tag.label)}`}
            className="relative z-10 hover:underline"
          >
            {tag.label}
          </Link>
          {i < tags.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

function buildImageUrl(url: string): string {
  return `${url}?fm=webp&w=600&h=360&fit=crop&auto=format`;
}

interface LatestItemProps {
  title: string;
  href: string;
  publishedAt: string;
  tags?: { _id: string; label: string }[];
  imageURL?: string;
  imageAlt?: string;
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
  return (
    <div className="group/latest relative flex flex-col overflow-hidden rounded-md border border-neutral-200 transition-all hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
      {imageURL ? (
        <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={buildImageUrl(imageURL)}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 group-hover/latest:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
          />
        </div>
      ) : (
        <div className="aspect-video bg-neutral-100 dark:bg-neutral-900" />
      )}
      <div className="p-4">
        <Link
          href={href}
          className="mt-0 text-base font-normal text-neutral-900 no-underline transition-colors group-hover/latest:underline before:absolute before:inset-0 before:opacity-0 dark:text-neutral-100"
        >
          {title}
        </Link>
        <p className="relative z-10 mt-1 mb-0 text-[10px] tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          {formatMonthYear(publishedAt)}
          {tags?.length ? <TagLinks tags={tags} /> : null}
        </p>
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
          {projects.map((project, i) =>
            project.slug ? (
              <LatestItem
                key={project._id}
                title={project.title}
                href={`/${pageSlugs.projects}/${project.slug.current}`}
                publishedAt={project.publishedAt}
                tags={project.tags}
                imageURL={project.imageURL}
                imageAlt={project.imageAlt}
                priority={i === 0}
              />
            ) : null
          )}
        </div>
      </div>

      <div className="border-t border-neutral-300 pt-8 dark:border-neutral-700">
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
