import { AUTHOR_NAME } from "./constants";

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

export const getProjectsScheme = ({
  title,
  url,
  description,
  projects,
}: {
  title: string;
  url: string;
  description: string;
  projects: {
    title: string;
    url: string;
    imageUrl: string;
    description: string;
    type: string[];
    // specific
    applicationCategory?: string;
    operatingSystem?: string;
    codeRepository?: string;
    programmingLanguage?: string;
  }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  url,
  description,
  hasPart: projects.map(
    ({
      title: pTitle,
      url: pUrl,
      imageUrl,
      description,
      type,
      // specific
      applicationCategory,
      operatingSystem,
      codeRepository,
      programmingLanguage,
    }) => ({
      "@type": type.length === 1 ? type[0] : type.map((t) => t),
      "@id": pUrl,
      name: pTitle,
      url: pUrl,
      image: imageUrl,
      description,
      // specific
      ...(applicationCategory && { applicationCategory }),
      ...(operatingSystem && { operatingSystem }),
      ...(codeRepository && { codeRepository }),
      ...(programmingLanguage && { programmingLanguage }),
    })
  ),
});
