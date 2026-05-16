import envConfig from "@/envConfig";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: ["/studio/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: ["/studio/"],
      },
    ],
    sitemap: [
      `${envConfig.baseUrl}/sitemap.xml`,
      `${envConfig.baseUrl}/video-sitemap.xml`,
    ],
  };
}
