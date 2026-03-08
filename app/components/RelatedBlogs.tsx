import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { relatedBlogsQuery, recentBlogsQuery } from "@/sanity/lib/queries";
import { BlogSanity } from "@/sanity/types/blogType";
import { Tags } from "./Tags";
import { pageSlugs } from "../utils/routes";
import { getTranslations } from "next-intl/server";

interface RelatedBlogsProps {
  currentSlug: string;
  tags: string[];
}

type RelatedBlog = Pick<
  BlogSanity,
  "_id" | "title" | "slug" | "publishedAt" | "imageURL" | "tags"
> & { imageAlt?: string };

function RelatedBlogCard({ blog }: { blog: RelatedBlog }) {
  return (
    <Link
      href={`/${pageSlugs.blog}/${blog.slug.current}`}
      className="group/card flex flex-col no-underline transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-sm">
        {blog.imageURL && (
          <Image
            src={blog.imageURL}
            alt={blog.imageAlt || blog.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover/card:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <h3 className="mt-2 mb-0 text-base font-bold text-gray-900 group-hover/card:underline dark:text-white">
        {blog.title}
      </h3>
      <div className="[&_ul]:mt-2 [&_ul]:mb-0">
        {blog.tags && blog.tags.length > 0 && (
          <Tags
            tags={blog.tags.slice(0, 3)}
            context={blog.title}
            renderLinks={false}
          />
        )}
      </div>
    </Link>
  );
}

export async function RelatedBlogs({ currentSlug, tags }: RelatedBlogsProps) {
  const t = await getTranslations("pages.blog");

  let relatedBlogs: RelatedBlog[];

  if (!tags || tags.length === 0) {
    relatedBlogs = await sanityFetch<RelatedBlog[]>({
      query: recentBlogsQuery,
      params: { currentSlug, excludeIds: [], limit: 3 },
    });
  } else {
    relatedBlogs = await sanityFetch<RelatedBlog[]>({
      query: relatedBlogsQuery,
      params: { currentSlug, tags },
    });

    if (relatedBlogs.length < 3) {
      const excludeIds = relatedBlogs.map((b) => b._id);
      const limit = 3 - relatedBlogs.length;

      const additionalBlogs = await sanityFetch<RelatedBlog[]>({
        query: recentBlogsQuery,
        params: { currentSlug, excludeIds, limit },
      });

      relatedBlogs = [...relatedBlogs, ...additionalBlogs];
    }
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-4 border-t border-black pt-4 dark:border-white">
      <h2 className="mt-0 -mb-4 text-lg font-bold">{t("relatedBlogs")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedBlogs.map((blog) => (
          <RelatedBlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
