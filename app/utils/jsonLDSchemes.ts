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
