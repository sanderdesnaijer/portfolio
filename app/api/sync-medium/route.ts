import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import envConfig from "@/envConfig";
import { client } from "@/sanity/lib/client";
import { getImageURL, getSlug } from "@/app/utils/utils";
import { blogQuery } from "@/sanity/lib/queries";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  "content:encoded": string;
  "dc:creator": string;
  category: string | string[];
}

function parseRSSFeed(xml: string): RSSItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: true,
  });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

export async function GET() {
  try {
    const response = await fetch(envConfig.mediumUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          error: `Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
        },
        { status: 502 }
      );
    }

    const xml = await response.text();
    const items = parseRSSFeed(xml);

    if (items.length === 0) {
      return NextResponse.json(
        { status: "error", error: "No items found in RSS feed" },
        { status: 502 }
      );
    }

    const results: { created: string[]; skipped: string[] } = {
      created: [],
      skipped: [],
    };

    for (const item of items) {
      const existing = await client.fetch(blogQuery, {
        slug: getSlug(item.link),
      });

      const publishedAt = new Date(item.pubDate).toISOString();
      const content = item["content:encoded"] || "";
      const categories = Array.isArray(item.category)
        ? item.category
        : item.category
          ? [item.category]
          : [];

      if (!existing) {
        await client.create({
          _type: "blogPost",
          title: item.title,
          publishedAt,
          mediumUrl: item.link,
          slug: { current: getSlug(item.link) },
          imageURL: getImageURL(content),
          description: content,
          categories,
          author: item["dc:creator"],
        });
        results.created.push(item.title);
      } else {
        results.skipped.push(item.title);
      }
    }

    return NextResponse.json({ status: "ok", ...results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}
