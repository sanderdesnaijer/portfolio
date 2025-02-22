import { QueryParams } from "@sanity/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingSanity } from "@/sanity/types";
import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import { convertDate } from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { MediumArticle } from "@/app/api/medium/types";

export const revalidate = 1;

const BlogPage = async ({ params }: { params: QueryParams }) => {
  const queryParams = await params;

  const article = (await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/medium/${queryParams.slug}`,
    { next: { revalidate: 600 } }
  ).then((data) => data.json())) as MediumArticle;

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
          className="prose prose-xl dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.description }}
        ></div>
      </ProjectLayout>
    </Layout>
  );
};

export default BlogPage;
