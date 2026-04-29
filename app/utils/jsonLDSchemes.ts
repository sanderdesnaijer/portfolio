import { toPlainText } from "next-sanity";
import { AUTHOR_NAME } from "./constants";
import { buildPageUrl } from "./utils";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import envConfig from "@/envConfig";
import { BlogSanity } from "@/sanity/types/blogType";
import { getExcerpt } from "./blogUtils";

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
    datePublished: project.publishedAt || project._createdAt,
    dateModified:
      project._updatedAt || project.publishedAt || project._createdAt,
    ...(project.tags?.length && {
      keywords: project.tags.map((tag) => tag.label).join(", "),
    }),
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
    ...(hasProductType && {
      brand: {
        "@type": "Brand",
        name: project.title,
      },
    }),
    ...(shouldIncludeOffer && {
      offers: {
        "@type": "Offer",
        "@id": `${url}#offer`,
        price: "0.00",
        priceCurrency: "USD",
        priceValidUntil: "2099-12-31",
        availability: "https://schema.org/InStock",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "US",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          doesNotShip: true,
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "US",
          },
        },
      },
      ...(hasProductType && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
          reviewCount: "1",
        },
        review: {
          "@type": "Review",
          author: createAuthor(),
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            (project.body && toPlainText(project.body)) ||
            "Portfolio project by the author.",
        },
      }),
    }),
    ...(project.jsonLdIsAuthor && {
      author: createAuthor(),
      publisher: createAuthor(),
    }),
    ...(shouldIncludeContext && {
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      isPartOf: {
        "@type": "CollectionPage",
        "@id": buildPageUrl(pageSlug),
        name: "Projects",
      },
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

export const getArticleScheme = (
  article: BlogSanity,
  pageSlug: string,
  hasDetail = false
) => {
  const url = buildPageUrl(pageSlug, article.slug.current);
  return {
    ...(hasDetail && { "@context": "https://schema.org" }),
    "@type": "BlogPosting",
    "@id": url,
    headline: article.title,
    url,
    ...(article.imageURL && { image: article.imageURL }),
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    author: createAuthor(),
    publisher: createAuthor(envConfig.baseUrl),
    ...(article.tags?.length && {
      keywords: article.tags.map((tag) => tag.label).join(", "),
    }),
    ...(article.mediumUrl && { sameAs: article.mediumUrl }),
    ...(hasDetail && {
      description: getExcerpt(article),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      isPartOf: {
        "@type": "Blog",
        "@id": buildPageUrl(pageSlug),
        name: "Blog",
      },
    }),
  };
};

export const getFAQScheme = (
  faq: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
  blogPost: articles.map((article) =>
    getArticleScheme(article, page.slug.current)
  ),
});
