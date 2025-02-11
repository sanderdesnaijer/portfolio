import { QueryParams } from "@sanity/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
import { fetchMediumArticles } from "@/app/utils/fetchMedium";
import { PageNotFound } from "@/app/components/PageNotFound";
import { LinkList } from "@/app/components/LinkList";
import { convertDate } from "@/app/utils/utils";

export const revalidate = 1;

const BlogPage = async ({ params }: { params: QueryParams }) => {
  const queryParams = await params;
  const articles = await fetchMediumArticles();
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });
  const article = articles.find((article) =>
    article.link.includes(queryParams.slug)
  );

  if (!article) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={article.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <p className="-mt-8 mb-2 py-2 text-xs font-light text-gray-700 uppercase dark:dark:text-gray-100">
        {convertDate(article.pubDate, true)}
      </p>

      <div
        className="prose prose-xl dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.description }}
      ></div>
      <LinkList
        links={[
          {
            title: "originally published on Medium",
            link: article.link,
            icon: "article",
          },
        ]}
      ></LinkList>
    </Layout>
  );
};

export default BlogPage;
