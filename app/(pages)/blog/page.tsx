"use server";
import {
  convertDate,
  extractTextFromHTML,
  getImageURL,
  getSlug,
} from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { TagSanity } from "@/sanity/types/tagType";
import { getMediumArticles } from "@/app/utils/api";
import { generatePageMetadata } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { getBlogsScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import envConfig from "@/envConfig";

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
    getMediumArticles().catch(() => []),
    getTranslations(),
  ]);

  const jsonLd = page && articles ? getBlogsScheme({ page, articles }) : null;
  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}

      {page ? (
        <>
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:my-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {title}
          </h1>
          <div className="relative flex-1 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-0 md:pb-6 dark:after:bg-white">
            <div className="mx-auto grid grid-cols-1 pt-0 md:pt-10">
              <ol
                aria-label={t("pages.blog.articles")}
                className="group mt-0 grid gap-10 pl-0"
              >
                {articles.map((article, index) => {
                  const imageURL = getImageURL(article.description);
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
                      href={`${page.slug.current}/${getSlug(article.link)}`}
                      imageURL={imageURL}
                      imageALT={article.title}
                      date={convertDate(article.pubDate)}
                      title={article.title}
                      body={body}
                      tags={tags}
                    />
                  );
                })}
              </ol>
            </div>
          </div>
        </>
      ) : (
        <NotFound
          title={t("error.404.generic.action")}
          description={t("error.404.generic.description")}
          href={envConfig.baseUrl}
        />
      )}
    </>
  );
}
