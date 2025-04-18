import { NextResponse } from "next/server";
import envConfig from "@/envConfig";
import { REVALIDATE_INTERVAL } from "@/app/utils/constants";
import { client } from "@/sanity/lib/client";
import { getImageURL, getSlug } from "@/app/utils/utils";
import { blogQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const response = await fetch(
      `${envConfig.rssApiUrl}?rss_url=${envConfig.mediumUrl}`,
      {
        next: { revalidate: REVALIDATE_INTERVAL },
      }
    );
    const feed = await response.json();

    const results: { created: string[]; skipped: string[] } = {
      created: [],
      skipped: [],
    };

    for (const item of feed.items) {
      const existing = await client.fetch(blogQuery, {
        slug: getSlug(item.link),
      });

      const publishedAt = new Date(item.pubDate).toISOString();

      if (!existing) {
        await client.create({
          _type: "blogPost",
          title: item.title,
          publishedAt,
          mediumUrl: item.link,
          slug: { current: getSlug(item.link) },
          imageURL: getImageURL(item.description),
          description: item.description,
          categories: item.categories,
          author: item.author,
        });
        results.created.push(item.title);
      } else {
        results.skipped.push(item.title);
      }
    }

    return NextResponse.json({ status: "ok", ...results });
  } catch (err) {
    return NextResponse.json({ status: "error", error: err }, { status: 500 });
  }
}
