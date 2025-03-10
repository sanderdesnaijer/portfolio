import { QueryParams } from "@sanity/client";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity, SettingSanity } from "@/sanity/types";
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

export const revalidate = 600;

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

  return generateMetaData({
    title,
    description,
    url: process.env.NEXT_PUBLIC_BASE_URL!,
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl: getImageURL(article.description) || page.imageURL,
    keywords: article.categories,
  });
}

const BlogPage = async ({ params }: { params: QueryParams }) => {
  const queryParams = await params;

  const article = await getMediumArticle(queryParams).catch(() => undefined);
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!article) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={article.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <ProjectLayout
        date={convertDate(article.pubDate, true)}
        links={[
          {
            title: "originally published on Medium",
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
