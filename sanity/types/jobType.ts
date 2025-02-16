import { SanityDocument } from "@sanity/client";
import { Block } from "./types";
import { TagSanity } from "./tagType";

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
  tags?: TagSanity[];
  link: string;
  imageURL: string;
  employmentType: "full-time" | "intern" | "contract";
  contractName?: string;
}
