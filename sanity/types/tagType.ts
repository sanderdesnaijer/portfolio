import { SanityDocument } from "@sanity/client";

export interface TagSanity extends SanityDocument {
  label: string;
}
