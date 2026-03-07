/* eslint-disable no-console */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-24",
  useCdn: false,
});

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
}

async function snapshotBlogSlugs() {
  const posts = await client.fetch<BlogPost[]>(
    `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, "slug": slug, publishedAt }`
  );

  const redirects = posts.map((post) => ({
    old: post.slug.current,
    new: "",
    title: post.title,
  }));

  const outputPath = path.resolve(
    __dirname,
    "../redirects/blog-redirects.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2) + "\n");

  console.log(`Snapshot saved to redirects/blog-redirects.json`);
  console.log(`Found ${redirects.length} blog posts:\n`);
  redirects.forEach((r) => {
    console.log(`  - ${r.old} (${r.title})`);
  });
  console.log(`\nFill in the "new" field for posts whose slug will change.`);
  console.log(`Leave "new" empty for posts that keep their current slug.`);
}

snapshotBlogSlugs().catch((err) => {
  console.error("Failed to snapshot blog slugs:", err);
  process.exit(1);
});
