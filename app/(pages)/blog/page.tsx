import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import { convertDate } from "@/app/utils/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, SettingSanity } from "@/sanity/types";
import Link from "next/link";
import Image from "next/image";
import { LinkList } from "@/app/components/LinkList";
import { fetchMediumArticles } from "@/app/utils/fetchMedium";

const slug = "blog";

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  const articles = await fetchMediumArticles();
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!page || !articles) {
    return <PageNotFound />;
  }

  const getImageURL = (articleDescription: string): string | undefined => {
    return articleDescription.match(/<img[^>]+src="([^">]+)"/)?.[1];
  };

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <div className="mx-auto grid grid-cols-1 py-10">
        <div className="grid gap-10">
          {articles.map((article, index) => {
            const imageURL = getImageURL(article.description);
            return (
              <div
                className="relative grid grid-cols-5 justify-between no-underline hover:opacity-90"
                key={index}
              >
                <div className="col-span-2">
                  {imageURL && (
                    <Image
                      className="mt-0 object-fill"
                      src={imageURL}
                      alt={article.title}
                      width={350}
                      height={350}
                      priority
                    />
                  )}
                </div>
                <div className="not-prose col-span-3 px-4">
                  <Link
                    href={article.link}
                    target="_blank"
                    className="no-underline before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
                  >
                    <h2 className="-mt-3 mb-2 text-xl text-[2.5rem] font-normal">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="mb-0 py-2 text-xs font-light text-gray-700 uppercase dark:dark:text-gray-100">
                    {convertDate(article.pubDate)}
                  </p>
                  <p className="mt-0 mb-0">
                    {article.categories.map((cat, index) => (
                      <span key={index}>
                        {cat}
                        {index < article.categories.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                  <LinkList
                    links={[
                      {
                        icon: "article",
                        link: article.link,
                        title: "Read blog",
                      },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
