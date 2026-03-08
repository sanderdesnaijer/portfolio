import { SanityDocument } from "next-sanity";
import { Block } from "./types";
import { TagSanity } from "./tagType";

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
  tags?: TagSanity[];
  author: string;
  mediumUrl?: string;
  imageURL?: string;
}
