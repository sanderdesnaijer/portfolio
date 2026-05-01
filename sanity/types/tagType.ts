import { SanityDocument } from "@sanity/client";

export interface TagSanity extends SanityDocument {
  label: string;
  slug: { current: string };
  metaDescription?: string;
  intro?: string;
}
