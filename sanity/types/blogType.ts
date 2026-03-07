import { SanityDocument } from "next-sanity";
import { Block } from "./types";

export interface BlogSanity extends SanityDocument {
  title: string;
  publishedAt: string;
  slug: {
    current: string;
  };
  mainImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  excerpt?: string;
  body?: Block[];
  /** @deprecated Legacy HTML content from Medium RSS — use `body` (Portable Text) instead */
  description?: string;
  categories: string[];
  author: string;
  mediumUrl?: string;
  imageURL?: string;
}
