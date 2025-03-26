import { toPlainText } from "next-sanity";
import { AUTHOR_NAME } from "./constants";
import { buildPageUrl } from "./utils";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { MediumArticle } from "../api/medium/types";

const createAuthor = (url?: string) => ({
  "@type": "Person",
  name: AUTHOR_NAME,
  ...(url && {
    url,
  }),
});

export const getWebsiteScheme = ({
  url,
  title,
  description,
  authorLink,
  imageUrl,
  createdAt,
  updatedAt,
  language = "en-US",
}: {
  url: string;
  title: string;
  description: string;
  author?: string;
  authorLink?: string;
  logo?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  language?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url,
  name: title,
  description,
  creator: createAuthor(authorLink),
  image: imageUrl,
  dateCreated: createdAt,
  dateModified: updatedAt,
  inLanguage: language,
});

export const getAboutScheme = ({
  url,
  links,
  jobTitle,
  jobs,
  imageUrl,
}: {
  url: string;
  links: string[];
  jobTitle: string;
  jobs: string[];
  imageUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url,
  sameAs: links,
  jobTitle,
  worksFor: jobs.map((job) => ({
    "@type": "Organization",
    name: job,
  })),
  image: imageUrl,
});

export const getProjectScheme = (
  project: ProjectTypeSanity,
  pageSlug: string,
  shouldIncludeContext = false
) => {
  const url = buildPageUrl(pageSlug, project.slug.current);
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
      offers: {
        "@type": "Offer",
        "@id": `${url}#offer`,
        price: "0.00",
        priceCurrency: "USD",
        availability: "https://schema.org/OnlineOnly",
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

export function convertToISO8601(dateString: string): string {
  // Parse the input date string
  const date = new Date(dateString);

  // Return the ISO 8601 format
  return date.toISOString();
}

export const getBlogsScheme = ({
  page,
  articles,
}: {
  page: PageSanity;
  articles: MediumArticle[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: page.title,
  url: buildPageUrl(page.slug.current),
  blogPost: articles.map((article) => ({
    "@type": "BlogPosting",
    "@id": article.link,
    headline: article.title,
    url: article.link,
    datePublished: convertToISO8601(article.pubDate),
    author: createAuthor(),
    publisher: {
      "@type": "Organization",
      name: "Medium",
      url: "https://medium.com",
    },
  })),
});
