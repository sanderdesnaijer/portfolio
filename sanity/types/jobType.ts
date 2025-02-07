import { SanityDocument } from "@sanity/client";
import { Block } from "./types";

export interface JobSanity extends SanityDocument {
  companyName: string;
  jobTitle: string;
  logo?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  description: Block[];
  startDate: string;
  endDate?: string;
  tags?: string;
  link: string;
  imageURL: string;
}
