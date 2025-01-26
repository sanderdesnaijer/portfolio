import { SanityDocument } from "@sanity/client";

interface Block {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks: string[];
  }>;
  style: string;
}

interface IconLink {
  title: string;
  link: string;
  icon: string;
}

export interface PostTypeSanity extends SanityDocument {
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  mainImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: string;
    };
    alt: string;
  };
  publishedAt: string;
  body: Array<Block>;
  links?: Array<IconLink>;
}

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

export interface SettingSanity extends SanityDocument {
  title: string;
  description: string;
  socialMedia: IconLink[];
}
