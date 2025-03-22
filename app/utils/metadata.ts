import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { buildPageUrl, generateTitle, getDescriptionFromSanity } from "./utils";
import { AUTHOR_NAME } from "./constants";

export const generateMetaData = ({
  title,
  description,
  author = AUTHOR_NAME,
  url,
  publishedTime,
  modifiedTime,
  imageUrl,
  imageAlt,
  keywords,
  canonical,
}: {
  title: string;
  description: string;
  author?: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  imageUrl: string;
  imageAlt?: string;
  keywords?: string[];
  canonical?: string;
}) => ({
  title,
  description,
  authors: [
    {
      name: author,
    },
  ],
  ...(keywords &&
    keywords.length && {
      keywords,
    }),
  openGraph: {
    title,
    description,
    type: "article",
    url,
    publishedTime,
    modifiedTime,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: imageAlt || title,
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: author,
    creator: "@sanderdesnaijer",
    title,
    description,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 675,
        alt: imageAlt || title,
      },
    ],
  },
  alternates: {
    canonical: canonical || url,
  },
});

export async function generatePageMetadata({
  pageSlug,
  project,
}: {
  pageSlug: string;
  project?: ProjectTypeSanity;
}) {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: pageSlug },
  });

  const title = generateTitle(page.title, project?.title);
  const description = project?.body
    ? getDescriptionFromSanity(project.body)
    : page.description;
  const url = buildPageUrl(pageSlug, project?.slug.current);
  const imageUrl = project?.imageURL || page.imageURL;
  const imageAlt = project?.imageAlt || page.imageAlt;
  const keywords = project?.tags?.map((tag) => tag.label);
  const publishedTime = project ? project._createdAt : page._createdAt;
  const modifiedTime = project ? project._updatedAt : page._updatedAt;

  return generateMetaData({
    title,
    description,
    publishedTime,
    modifiedTime,
    imageAlt,
    imageUrl,
    url,
    keywords,
  });
}
