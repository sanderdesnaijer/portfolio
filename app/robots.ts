import envConfig from "@/envConfig";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/studio/"],
    },
    sitemap: [`${envConfig.baseUrl}/sitemap.xml`],
  };
}
