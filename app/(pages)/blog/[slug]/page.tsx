import { QueryParams } from "@sanity/client";
import { blogQuery, pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import {
  buildPageUrl,
  convertDate,
  extractTextFromHTML,
  generateTitle,
  getImageURL,
} from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { generateMetaData } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { getArticleScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import React from "react";
import { PageLayout } from "@/app/components/PageLayout";
import { BlogSanity } from "@/sanity/types/blogType";

import { client } from "@/sanity/lib/client";

const { blog: slug } = pageSlugs;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost"]{ "slug": slug }`
  );

  return slugs!.map(({ slug }) => ({ slug: slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await sanityFetch<BlogSanity>({
    query: blogQuery,
    params,
  });

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
  const url = buildPageUrl(page.slug.current, article.slug.current);

  return generateMetaData({
    title,
    description,
    url,
    publishedTime: article.publishedAt,
    modifiedTime: article.publishedAt,
    imageUrl,
    keywords: article.categories,
    canonical: article.mediumUrl,
  });
}

const BlogPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const resolvedParams = await params;
  const [article, t] = await Promise.all([
    sanityFetch<BlogSanity>({
      query: blogQuery,
      params: { slug: resolvedParams.slug },
    }),
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
            date={convertDate(article.publishedAt, true)}
            links={[
              {
                title: t("pages.blog.articleLinkMedium"),
                link: article.mediumUrl,
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
