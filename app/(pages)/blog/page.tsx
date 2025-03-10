import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import {
  convertDate,
  extractTextFromHTML,
  getImageURL,
} from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, SettingSanity } from "@/sanity/types";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { TagSanity } from "@/sanity/types/tagType";
import { getMediumArticles } from "@/app/utils/api";
import { generatePageMetadata } from "@/app/utils/metadata";

const slug = "blog";

export const revalidate = 600;

const getSlug = (url: string): string => {
  const match = url.match(/\/([^\/]+)-[a-f0-9]{12}\?/);
  return match ? match[1] : "not-found";
};

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
}

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug },
  });

  const articles = await getMediumArticles().catch(() => {
    return [];
  });

  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!page || !articles) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <div className="mx-auto grid grid-cols-1 py-10">
        <ol className="group mt-0 grid gap-10 pl-0">
          {articles.map((article, index) => {
            const imageURL = getImageURL(article.description);
            const tags = article.categories.map<TagSanity>((cat, index) => ({
              label: cat,
              _id: `${cat}-${index}`,
              _rev: "",
              _type: "tag",
              _createdAt: new Date().toISOString(),
              _updatedAt: new Date().toISOString(),
            }));

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
    </Layout>
  );
}
