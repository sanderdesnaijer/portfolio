"use server";
import { QueryParams } from "@sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
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
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";

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
  const article = await getMediumArticle(queryParams).catch(() => undefined);
  const { setting, menuItems } = await fetchCommonData();
  const t = await getTranslations();

  const title = article ? article.title : t("error.404.blog.title");
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
              title: t("pages.blog.articleLinkMedium"),
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
          title={t("error.404.blog.action")}
          description={t("error.404.blog.description")}
          href={buildPageUrl(slug)}
        />
      )}
    </Layout>
  );
};

export default BlogPage;
