"use server";
import { QueryParams } from "@sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import {
  buildPageUrl,
  convertDate,
  extractTextFromHTML,
  generateTitle,
  getImageURL,
  getSlug,
} from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { getMediumArticle } from "@/app/utils/api";
import { generateMetaData } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { getArticleScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import React from "react";
import { PageLayout } from "@/app/components/PageLayout";

const { blog: slug } = pageSlugs;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const queryParams = await params;
  const article = await getMediumArticle(queryParams).catch(() => undefined);
  if (!article) {
    const t = await getTranslations();
    return {
      title: t("error.404.blog.title"),
      description: t("error.404.blog.description"),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug },
  });

  const title = generateTitle(page.title, article.title);
  const description = extractTextFromHTML(article?.description);
  const imageUrl = getImageURL(article?.description) || page.imageURL;
  const url = buildPageUrl(page.slug.current, getSlug(article.link));

  return generateMetaData({
    title,
    description,
    url,
    publishedTime: article.pubDate,
    modifiedTime: article.pubDate,
    imageUrl,
    keywords: article.categories,
    canonical: article.link,
  });
}

const BlogPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const queryParams = await params;

  const [article, t] = await Promise.all([
    getMediumArticle(queryParams).catch(() => undefined),
    getTranslations(),
  ]);

  const jsonLd = article ? getArticleScheme(article, true) : null;

  const title = article ? article.title : t("error.404.blog.title");

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}

      {article ? (
        <PageLayout title={title}>
          <ProjectLayout
            date={convertDate(article.pubDate, true)}
            links={[
              {
                title: t("pages.blog.articleLinkMedium"),
                link: article.link,
                icon: "article",
              },
            ]}
          >
            <div
              className="prose prose-xl dark:prose-invert break-words [&>p>a]:underline-offset-2 [&>p>a]:hover:underline-offset-3 [&>ul>li>a]:underline-offset-2 [&>ul>li>a]:hover:underline-offset-3"
              dangerouslySetInnerHTML={{ __html: article.description }}
            ></div>
          </ProjectLayout>
        </PageLayout>
      ) : (
        <NotFound
          title={title}
          description={t("error.404.blog.description")}
          href={buildPageUrl(slug)}
          action={t("error.404.blog.action")}
        />
      )}
    </>
  );
};

export default BlogPage;
