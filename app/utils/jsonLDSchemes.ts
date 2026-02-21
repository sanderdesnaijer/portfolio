import { toPlainText } from "next-sanity";
import { AUTHOR_NAME } from "./constants";
import { buildPageUrl, extractTextFromHTML } from "./utils";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import envConfig from "@/envConfig";
import { BlogSanity } from "@/sanity/types/blogType";

const createAuthor = (url?: string) => ({
  "@type": "Person",
  name: AUTHOR_NAME,
  ...(url && {
    url,
  }),
});

export const getWebsiteScheme = (page: PageSanity, authorLink?: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: envConfig.baseUrl,
  name: page.title,
  description: page.description,
  creator: createAuthor(authorLink),
  image: page.imageURL,
  dateCreated: page._createdAt,
  dateModified: page._updatedAt,
  inLanguage: "en-US",
});

export const getAboutScheme = ({
  page,
  links,
  jobTitle,
  jobs,
}: {
  page: PageSanity;
  links: string[];
  jobTitle: string;
  jobs: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: buildPageUrl(page.slug.current),
  sameAs: links,
  jobTitle,
  worksFor: jobs.map((job) => ({
    "@type": "Organization",
    name: job,
  })),
  image: page.imageURL,
});

export const getProjectScheme = (
  project: ProjectTypeSanity,
  pageSlug: string,
  shouldIncludeContext = false
) => {
  const url = buildPageUrl(pageSlug, project.slug.current);
  const hasProductType = project.jsonLdType.includes("Product");
  const shouldIncludeOffer =
    hasProductType || Boolean(project.jsonLdDownloadUrl);
  return {
    ...(shouldIncludeContext && {
      "@context": "https://schema.org",
    }),
    "@type":
      project.jsonLdType.length === 1
        ? project.jsonLdType[0]
        : project.jsonLdType.map((t) => t),
    "@id": url,
    name: project.title,
    url,
    image: project.imageURL,
    description: project.body && toPlainText(project.body),
    // specific
    ...(project.jsonLdApplicationCategory && {
      applicationCategory: project.jsonLdApplicationCategory,
    }),
    ...(project.jsonLdOperatingSystem && {
      operatingSystem: project.jsonLdOperatingSystem,
    }),
    ...(project.jsonLdCodeRepository && {
      codeRepository: project.jsonLdCodeRepository,
    }),
    ...(project.jsonLdProgrammingLanguage && {
      programmingLanguage: project.jsonLdProgrammingLanguage,
    }),
    ...(project.jsonLdDownloadUrl && {
      downloadUrl: project.jsonLdDownloadUrl,
    }),
    ...(shouldIncludeOffer && {
      offers: {
        "@type": "Offer",
        "@id": `${url}#offer`,
        price: "0.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          doesNotShip: true,
        },
      },
    }),
    ...(project.jsonLdIsAuthor && {
      author: createAuthor(),
      publisher: createAuthor(),
    }),
  };
};

export const getProjectsScheme = ({
  page,
  projects,
}: {
  page: PageSanity;
  projects: ProjectTypeSanity[];
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: page.title,
  url: buildPageUrl(page.slug.current),
  description: page.description,
  hasPart: projects.map((project) =>
    getProjectScheme(project, page.slug.current)
  ),
});

export const getArticleScheme = (article: BlogSanity, hasDetail = false) => ({
  "@type": "BlogPosting",
  "@id": article.mediumUrl,
  headline: article.title,
  url: article.mediumUrl,
  datePublished: article.publishedAt,
  author: createAuthor(),
  publisher: {
    "@type": "Organization",
    name: "Medium",
    url: "https://medium.com",
  },
  ...(hasDetail &&
    article.description && {
      description: extractTextFromHTML(article.description),
    }),
});

export const getBlogsScheme = ({
  page,
  articles,
}: {
  page: PageSanity;
  articles: BlogSanity[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: page.title,
  url: buildPageUrl(page.slug.current),
  blogPost: articles.map((article) => getArticleScheme(article)),
});
