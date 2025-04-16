import { SanityDocument } from "next-sanity";

export interface BlogSanity extends SanityDocument {
  title: string;
  publishedAt: string;
  mediumUrl: string;
  slug: {
    current: string;
  };
  imageURL: string;
  description: string;
  categories: string[];
  author: string;
}
