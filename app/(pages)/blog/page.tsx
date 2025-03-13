"use server";
import { Layout } from "@/app/components/Layout";
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
import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";

const slug = "blog";

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
  const t = await getTranslations();

  const title = page ? page.title : t("error.404.generic.title");

  return (
    <Layout
      pageTitle={title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
      {page ? (
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
      ) : (
        <NotFound
          title={t("error.404.generic.action")}
          description={t("error.404.generic.description")}
          href={`${process.env.NEXT_PUBLIC_BASE_URL}` || `/`}
        />
      )}
    </Layout>
  );
}
