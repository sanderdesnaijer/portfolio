import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import { convertDate } from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, SettingSanity } from "@/sanity/types";
import { ProjectListItem } from "@/app/components/ProjectListItem";
import { TagSanity } from "@/sanity/types/tagType";
import { MediumArticle } from "@/app/api/medium/types";

const slug = "blog";

export const revalidate = 600;

const getSlug = (url: string): string => {
  const match = url.match(/\/([^\/]+)-[a-f0-9]{12}\?/);
  return match ? match[1] : "not-found";
};

const getImageURL = (articleDescription: string): string | undefined => {
  return articleDescription.match(/<img[^>]+src="([^">]+)"/)?.[1];
};

function extractTextFromHTML(html: string) {
  const withoutFigcaptions = html.replace(
    /<figcaption>[^]*?<\/figcaption>/g,
    ""
  );
  const text = withoutFigcaptions.replace(/<[^>]*>/g, " ");
  const cleanText = text.replace(/\s+/g, " ").trim();
  return cleanText.substring(0, 200) + "...";
}

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  const articles = (await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/medium`,
    { next: { revalidate: revalidate } }
  )
    .then((data) => data.json())
    .catch(() => {
      return [];
    })) as MediumArticle[];

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
