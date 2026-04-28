import { QueryParams } from "@sanity/client";
import { blogQuery, pageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { buildPageUrl, convertDate, generateTitle } from "@/app/utils/utils";
import { ProjectLayout } from "@/app/components/ProjectLayout";
import { generateMetaData } from "@/app/utils/metadata";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { pageSlugs } from "@/app/utils/routes";
import { getArticleScheme, getFAQScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import { PageLayout } from "@/app/components/PageLayout";
import { BlogSanity } from "@/sanity/types/blogType";
import { IconLink } from "@/sanity/types/types";
import { BlogContent } from "@/app/components/BlogContent";
import { Tags } from "@/app/components/Tags";
import { RelatedBlogs } from "@/app/components/RelatedBlogs";
import { client } from "@/sanity/lib/client";
import { getExcerpt } from "@/app/utils/blogUtils";

const { blog: slug } = pageSlugs;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost"]{ "slug": slug }`
  );

  return slugs!.map(({ slug }) => ({ slug: slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await sanityFetch<BlogSanity>({
    query: blogQuery,
    params,
  });

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
  const description = getExcerpt(article);
  const rawImageUrl = article.imageURL || page.imageURL;
  const OG_PARAMS = "w=1200&h=630&fit=crop&auto=format";
  const imageUrl =
    rawImageUrl && !rawImageUrl.includes("w=1200")
      ? `${rawImageUrl}${rawImageUrl.includes("?") ? "&" : "?"}${OG_PARAMS}`
      : rawImageUrl;
  const url = buildPageUrl(page.slug.current, article.slug.current);

  return generateMetaData({
    title,
    description,
    url,
    publishedTime: article.publishedAt,
    modifiedTime: article._updatedAt || article.publishedAt,
    imageUrl,
    keywords: article.tags?.map((tag) => tag.label),
  });
}

const BlogPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const resolvedParams = await params;
  const article = await sanityFetch<BlogSanity>({
    query: blogQuery,
    params: { slug: resolvedParams.slug },
  });

  if (!article) {
    notFound();
  }

  const t = await getTranslations("pages.blog");
  const jsonLd = getArticleScheme(article, slug, true);
  const hasFaq = article.faq && article.faq.length > 0;
  const hasPortableText = article.body && article.body.length > 0;
  const validLinks = article.links?.filter(
    (l): l is IconLink => !!l.title && !!l.link && !!l.icon
  );

  return (
    <>
      <JsonLd value={jsonLd} />
      {hasFaq && <JsonLd value={getFAQScheme(article.faq!)} />}

      <PageLayout title={article.title}>
        <ProjectLayout
          date={convertDate(article.publishedAt, true)}
          links={validLinks?.length ? validLinks : undefined}
        >
          <div className="prose prose-xl dark:prose-invert break-words [&>p>a]:underline-offset-2 [&>p>a]:hover:underline-offset-3 [&>ul>li>a]:underline-offset-2 [&>ul>li>a]:hover:underline-offset-3">
            {hasPortableText ? (
              <BlogContent value={article.body!} />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  // eslint-disable-next-line @typescript-eslint/no-deprecated
                  __html: article.description || "",
                }}
              />
            )}
            {hasFaq && (
              <section>
                <h2>{t("faqHeading")}</h2>
                <dl>
                  {article.faq!.map((item, index) => (
                    <div key={index}>
                      <dt className="font-semibold">{item.question}</dt>
                      <dd>{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
        </ProjectLayout>
        {article.tags && <Tags tags={article.tags} context={article.title} />}
        <RelatedBlogs
          currentSlug={article.slug.current}
          tags={article.tags?.map((tag) => tag.label) || []}
        />
      </PageLayout>
    </>
  );
};

export default BlogPage;
