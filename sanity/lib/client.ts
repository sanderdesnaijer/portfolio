import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import envConfig from "@/envConfig";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: envConfig.sanityToken,
  useCdn: process.env.NODE_ENV === "production", // Use CDN in production
});
