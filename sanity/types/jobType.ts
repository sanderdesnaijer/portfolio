import { SanityDocument } from "@sanity/client";
import { Block, IconLink } from "./types";

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
  links?: Array<IconLink>;
  imageURL: string;
}
