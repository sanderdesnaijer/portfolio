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
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
      },
    ],
    sitemap: [
      `${envConfig.baseUrl}/sitemap.xml`,
      `${envConfig.baseUrl}/video-sitemap.xml`,
    ],
  };
}
