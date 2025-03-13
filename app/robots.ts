import { MetadataRoute } from "next";
import { getBaseUrl } from "./utils/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/studio/"],
    },
    sitemap: [`${getBaseUrl()}/sitemap.xml`],
  };
}
