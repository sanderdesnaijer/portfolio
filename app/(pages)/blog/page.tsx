"use server";
import { extractTextFromHTML } from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { blogsQuery, pageQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { TagSanity } from "@/sanity/types/tagType";
import { generatePageMetadata } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { getBlogsScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import envConfig from "@/envConfig";
import { PageLayout } from "@/app/components/PageLayout";
import { BlogSanity } from "@/sanity/types/blogType";

const { blog: slug } = pageSlugs;

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
}

export default async function Page() {
  const [page, articles, t] = await Promise.all([
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug },
    }),
    sanityFetch<BlogSanity[]>({
      query: blogsQuery,
    }),
    getTranslations(),
  ]);

  const jsonLd = page && articles ? getBlogsScheme({ page, articles }) : null;
  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      {page ? (
        <PageLayout title={title}>
          <div className="mx-auto grid grid-cols-1 pt-0 md:pt-10">
            <ol
              aria-label={t("pages.blog.articles")}
              className="group mt-0 grid gap-10 pl-0"
            >
              {articles.map((article, index) => {
                const tags = article.categories.map<TagSanity>(
                  (cat, index) => ({
                    label: cat,
                    _id: `${cat}-${index}`,
                    _rev: "",
                    _type: "tag",
                    _createdAt: new Date().toISOString(),
                    _updatedAt: new Date().toISOString(),
                  })
                );

                const body = extractTextFromHTML(article.description);

                return (
                  <ProjectListItem
                    key={index}
                    href={`${page.slug.current}/${article.slug.current}`}
                    imageURL={article.imageURL}
                    imageALT={article.title}
                    date={article.publishedAt}
                    title={article.title}
                    body={body}
                    tags={tags}
                  />
                );
              })}
            </ol>
          </div>
        </PageLayout>
      ) : (
        <NotFound
          title={title}
          action={t("error.404.generic.action")}
          description={t("error.404.generic.description")}
          href={envConfig.baseUrl}
        />
      )}
    </>
  );
}
