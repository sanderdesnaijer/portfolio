import { toPlainText } from "next-sanity";
import { AUTHOR_NAME } from "./constants";
import { buildPageUrl } from "./utils";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";

export const getWebsiteScheme = ({
  url,
  title,
  description,
  author = AUTHOR_NAME,
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
  creator: {
    "@type": "Person",
    name: author,
    ...(authorLink && {
      url: authorLink,
    }),
  },
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
  pageSlug: string
) => ({
  "@type":
    project.jsonLdType.length === 1
      ? project.jsonLdType[0]
      : project.jsonLdType.map((t) => t),
  "@id": buildPageUrl(pageSlug, project.slug.current),
  name: project.title,
  url: buildPageUrl(pageSlug, project.slug.current),
  image: project.imageURL,
  description: project.body && toPlainText(project.body),
  // specific
  ...(project.applicationCategory && {
    applicationCategory: project.applicationCategory,
  }),
  ...(project.operatingSystem && {
    operatingSystem: project.operatingSystem,
  }),
  ...(project.codeRepository && { codeRepository: project.codeRepository }),
  ...(project.programmingLanguage && {
    programmingLanguage: project.programmingLanguage,
  }),
});

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
