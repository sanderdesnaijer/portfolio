"use server";
import { QueryParams } from "@sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
import {
  convertDate,
  extractTextFromHTML,
  getImageURL,
} from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { getMediumArticle } from "@/app/utils/api";
import { generateMetaData } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";

const slug = "blog";

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
      title: t("pages.blog.404.title"),
      description: t("pages.blog.404.description"),
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
  const baseTitle = `Sander de Snaijer | ${page.title}`;

  const title = `${baseTitle} | ${article.title}`;
  const description = extractTextFromHTML(article?.description);
  const imageUrl = getImageURL(article?.description) || page.imageURL;

  return generateMetaData({
    title,
    description,
    url: process.env.NEXT_PUBLIC_BASE_URL!,
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl,
    keywords: article.categories,
    canonical: article.link,
  });
}

const BlogPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const queryParams = await params;
  const article = await getMediumArticle(queryParams).catch(() => undefined);
  const { setting, menuItems } = await fetchCommonData();
  const t = await getTranslations();

  const title = article ? article.title : t("pages.blog.404.title");

  return (
    <Layout
      pageTitle={title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
      {article ? (
        <ProjectLayout
          date={convertDate(article.pubDate, true)}
          links={[
            {
              title: t("medium-article-link"),
              link: article.link,
              icon: "article",
            },
          ]}
        >
          <div
            className="prose prose-xl dark:prose-invert [&>p>a]:underline-offset-2 [&>p>a]:hover:underline-offset-3 [&>ul>li>a]:underline-offset-2 [&>ul>li>a]:hover:underline-offset-3"
            dangerouslySetInnerHTML={{ __html: article.description }}
          ></div>
        </ProjectLayout>
      ) : (
        <NotFound
          title={t("pages.blog.404.action")}
          description={t("pages.blog.404.description")}
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}` || `/${slug}`}
        />
      )}
    </Layout>
  );
};

export default BlogPage;
