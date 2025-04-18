import { SanityDocument } from "@sanity/client";
import { IconLink } from "./types";

export interface SettingSanity extends SanityDocument {
  title: string;
  description: string;
  socialMedia: IconLink[];
  imageURL: string;
  imageAlt: string;
}
