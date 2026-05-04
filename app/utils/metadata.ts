import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity, SettingSanity } from "@/sanity/types";
import { buildPageUrl, getDescriptionFromSanity } from "./utils";
import { AUTHOR_NAME } from "./constants";
import envConfig from "@/envConfig";

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
  ...(keywords?.length ? { keywords } : {}),
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
      },
    ],
    locale: "en_US",
    site_name: title,
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
  // Google Search Console verification
  ...(envConfig.googleSiteVerification && {
    verification: {
      google: envConfig.googleSiteVerification,
    },
  }),
  icons: {
    icon: [
      {
        url: "/meta/light/favicon-16x16.png",
        media: "(prefers-color-scheme: light)",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/meta/dark/favicon-16x16.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/meta/light/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/meta/dark/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/meta/light/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/meta/dark/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      // small
      {
        url: "/meta/light/apple-icon.png",
        sizes: "72x72",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/meta/dark/apple-icon.png",
        sizes: "72x72",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      // medium
      {
        url: "/meta/light/apple-icon@2x.png",
        sizes: "144x144",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/meta/dark/apple-icon@2x.png",
        sizes: "144x144",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      // large
      {
        url: "/meta/light/apple-icon@3x.png",
        sizes: "216x216",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/meta/dark/apple-icon@3x.png",
        sizes: "216x216",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/meta/light/apple-touch-icon.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon-precomposed",
        url: "/meta/dark/apple-touch-icon.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
    ],
  },
});

export async function generatePageMetadata({
  pageSlug,
  project,
  description: descriptionOverride,
  pageTitle,
  disableBrandTitleSuffix,
}: {
  pageSlug: string;
  project?: ProjectTypeSanity;
  description?: string;
  pageTitle?: string;
  disableBrandTitleSuffix?: boolean;
}) {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: pageSlug },
  });
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  const brand = setting?.title || AUTHOR_NAME;
  const baseTitle = pageTitle ?? (project ? project.title : page?.title);
  const title = disableBrandTitleSuffix ? baseTitle : `${baseTitle} | ${brand}`;

  const projectDescription = project?.body?.length
    ? getDescriptionFromSanity(project.body)
    : "";
  const description =
    descriptionOverride ||
    projectDescription ||
    page?.description ||
    setting?.description ||
    "";

  const url = pageSlug
    ? buildPageUrl(pageSlug, project?.slug.current)
    : envConfig.baseUrl;
  const imageUrl = project?.imageURL || page?.imageURL || setting?.imageURL;
  const imageAlt = project?.imageAlt || page?.imageAlt || setting?.imageAlt;

  const keywords = project?.tags?.map((tag) => tag.label);
  const fallbackTimestamp = new Date().toISOString();
  const publishedTime =
    project?._createdAt || page?._createdAt || fallbackTimestamp;
  const modifiedTime =
    project?._updatedAt || page?._updatedAt || fallbackTimestamp;

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
