import { SanityDocument } from "@sanity/client";
import { Block } from "./types";

export interface PageSanity extends SanityDocument {
  name: string;
  title: string;
  description: string;
  slug: {
    _type: "slug";
    current: string;
  };
  mainImage: {
    _type: "image";
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  publishedAt: string;
  body: Block[];
  imageAlt: string;
  imageURL: string;
}
