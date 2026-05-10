import { SanityDocument } from "@sanity/client";
import { Block, IconLink, TextBlock } from "./types";
import { TagSanity } from "./tagType";

export interface FaqItem {
  _key: string;
  question: string;
  answer: TextBlock[];
}

export interface ProjectTypeSanity extends SanityDocument {
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
  excerpt?: string;
  body: Array<Block>;
  links?: Array<IconLink>;
  faq?: FaqItem[];
  companyName?: string;
  companyLogo?: string;
  tags?: TagSanity[];
  imageURL?: string;
  imageAlt?: string;
  // JSON LD
  jsonLdType: string[];
  jsonLdApplicationCategory?: string;
  jsonLdOperatingSystem?: string;
  jsonLdCodeRepository?: string;
  jsonLdProgrammingLanguage?: string;
  jsonLdDownloadUrl?: string;
  jsonLdIsAuthor?: boolean;
}
