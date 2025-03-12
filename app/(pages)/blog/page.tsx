import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
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
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";

const slug = "blog";

export const revalidate = 3600;

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
  const { setting, menuItems } = await fetchCommonData();

  if (!page || !articles) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
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
