"use server";
import { QueryParams } from "@sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import {
  convertDate,
  extractTextFromHTML,
  getImageURL,
} from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { getMediumArticle } from "@/app/utils/api";
import { generateMetaData } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { REVALIDATE_INTERVAL } from "@/app/utils/constants";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const queryParams = await params;
  const article = await getMediumArticle(queryParams).catch(() => undefined);
  if (!article) {
    return;
  }

  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: "blog" },
  });
  const baseTitle = `Sander de Snaijer | ${page.title}`;

  const title = `${baseTitle} | ${article.title}`;
  const description = extractTextFromHTML(article?.description);
  const imageUrl = getImageURL(article?.description) || page.imageURL;

  return {
    ...generateMetaData({
      title,
      description,
      url: process.env.NEXT_PUBLIC_BASE_URL!,
      publishedTime: page._createdAt,
      modifiedTime: page._updatedAt,
      imageUrl,
      keywords: article.categories,
      canonical: article.link,
    }),
    revalidate: REVALIDATE_INTERVAL,
  };
}

const BlogPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const queryParams = await params;
  const t = await getTranslations();

  const article = await getMediumArticle(queryParams).catch(() => undefined);
  const { setting, menuItems } = await fetchCommonData();

  if (!article) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={article.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
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
    </Layout>
  );
};

export default BlogPage;
