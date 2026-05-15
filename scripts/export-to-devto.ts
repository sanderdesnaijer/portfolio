/**
 * Export a Sanity blog post to dev.to-compatible markdown.
 *
 * Usage:
 *   npm run export:devto -- <slug>
 *   npm run export:devto -- <slug> --list   # list all slugs instead
 *
 * Output lands in scripts/devto-exports/<slug>.md
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local from project root
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import * as fs from "fs";

// ---------------------------------------------------------------------------
// Sanity client (standalone -- no Next.js runtime needed)
// ---------------------------------------------------------------------------

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.\n" +
      "Make sure your .env.local is loaded. You can run:\n" +
      "  npx dotenv -e .env.local -- npx ts-node scripts/export-to-devto.ts <slug>"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-24",
  useCdn: false,
});

const imgBuilder = createImageUrlBuilder({ projectId, dataset });

function sanityImageUrl(source: SanityImage): string | null {
  // If the asset has a direct URL (from GROQ dereferencing), use it
  if (source.asset?.url) {
    return source.asset.url;
  }
  // If we have a _ref, the image-url builder can construct a CDN URL
  if (source.asset?._ref) {
    try {
      return imgBuilder.image(source).auto("format").url();
    } catch {
      return null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SanityImage {
  _type: "image";
  asset: { _ref: string; url?: string };
  alt?: string;
}

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface Span {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
}

interface Block {
  _type: "block";
  _key?: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
}

interface CodeBlock {
  _type: "codeBlock";
  code: string;
  language?: string;
}

interface YouTubeBlock {
  _type: "youTube";
  url?: string;
}

interface ImageBlock {
  _type: "image";
  asset: { _ref: string; url?: string };
  alt?: string;
}

interface TableBlock {
  _type: "table";
  caption?: string;
  headers?: string[];
  rows?: { cells?: string[] }[];
}

interface EmbedBlock {
  _type: "embed";
  type?: "component" | "iframe";
  url?: string;
  caption?: string;
  componentId?: string;
}

type PortableTextBlock =
  | Block
  | CodeBlock
  | YouTubeBlock
  | ImageBlock
  | TableBlock
  | EmbedBlock;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  mainImage?: SanityImage;
  imageURL?: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  tags?: { _id: string; label: string }[];
  author?: string;
  faq?: { question: string; answer?: PortableTextBlock[] }[];
}

// ---------------------------------------------------------------------------
// Portable Text -> Markdown conversion
// ---------------------------------------------------------------------------

function spanToMarkdown(span: Span, markDefs: MarkDef[]): string {
  let text = span.text;
  if (!span.marks || span.marks.length === 0) return text;

  for (const mark of span.marks) {
    // Check if it's a decorator or an annotation
    if (mark === "strong") {
      text = `**${text}**`;
    } else if (mark === "em") {
      text = `*${text}*`;
    } else if (mark === "code") {
      text = `\`${text}\``;
    } else {
      // Annotation -- look up in markDefs
      const def = markDefs.find((d) => d._key === mark);
      if (def && def._type === "link" && def.href) {
        const href = def.href.startsWith("/")
          ? `https://www.sanderdesnaijer.com${def.href}`
          : def.href;
        text = `[${text}](${href})`;
      }
    }
  }

  return text;
}

function blockChildrenToMarkdown(block: Block): string {
  const markDefs = block.markDefs || [];
  return (block.children || [])
    .map((child) => spanToMarkdown(child, markDefs))
    .join("");
}

function extractYouTubeId(url: string): string | null {
  // Handles youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function portableTextToMarkdown(blocks: PortableTextBlock[]): string {
  const lines: string[] = [];
  let prevListItem: string | undefined;
  let bulletIndex = 0;

  for (const block of blocks) {
    // -- Code block --
    if (block._type === "codeBlock") {
      const cb = block as CodeBlock;
      lines.push(`\`\`\`${cb.language || ""}`);
      lines.push(cb.code);
      lines.push("```");
      lines.push("");
      prevListItem = undefined;
      continue;
    }

    // -- YouTube embed --
    if (block._type === "youTube") {
      const yt = block as YouTubeBlock;
      if (yt.url) {
        const videoId = extractYouTubeId(yt.url);
        if (videoId) {
          // dev.to liquid tag
          lines.push(`{% youtube ${videoId} %}`);
          lines.push("");
        }
      }
      prevListItem = undefined;
      continue;
    }

    // -- Image --
    if (block._type === "image") {
      const img = block as ImageBlock;
      const url = sanityImageUrl(img);
      const alt = img.alt || "";
      if (url) {
        lines.push(`![${alt}](${url})`);
        lines.push("");
      } else {
        lines.push(`<!-- image could not be resolved: ${alt || "unknown"} -->`);
        lines.push("");
      }
      prevListItem = undefined;
      continue;
    }

    // -- Table --
    if (block._type === "table") {
      const tbl = block as TableBlock;
      if (tbl.headers && tbl.headers.length > 0) {
        lines.push("| " + tbl.headers.join(" | ") + " |");
        lines.push("| " + tbl.headers.map(() => "---").join(" | ") + " |");
        for (const row of tbl.rows || []) {
          const cells = row.cells || [];
          // Pad to header count
          while (cells.length < tbl.headers.length) cells.push("");
          lines.push("| " + cells.join(" | ") + " |");
        }
        if (tbl.caption) {
          lines.push(`*${tbl.caption}*`);
        }
        lines.push("");
      }
      prevListItem = undefined;
      continue;
    }

    // -- Embed --
    if (block._type === "embed") {
      const emb = block as EmbedBlock;
      if (emb.type === "iframe" && emb.url) {
        // Check if it's a YouTube URL first
        const ytId = extractYouTubeId(emb.url);
        if (ytId) {
          lines.push(`{% youtube ${ytId} %}`);
        } else {
          lines.push(`{% embed ${emb.url} %}`);
        }
        if (emb.caption) {
          lines.push(`*${emb.caption}*`);
        }
        lines.push("");
      } else if (emb.type === "component") {
        // Can't render React components on dev.to, leave a note
        lines.push(
          `> Interactive component: ${emb.componentId || "embedded content"}${emb.caption ? ` - ${emb.caption}` : ""}`
        );
        lines.push("");
      }
      prevListItem = undefined;
      continue;
    }

    // -- Regular text block --
    if (block._type === "block") {
      const b = block as Block;
      const text = blockChildrenToMarkdown(b);

      // Handle lists
      if (b.listItem) {
        if (b.listItem !== prevListItem) {
          bulletIndex = 0;
        }
        const indent = "  ".repeat((b.level || 1) - 1);
        if (b.listItem === "bullet") {
          lines.push(`${indent}- ${text}`);
        } else {
          bulletIndex++;
          lines.push(`${indent}${bulletIndex}. ${text}`);
        }
        prevListItem = b.listItem;
        continue;
      }

      // End of list -- add blank line
      if (prevListItem) {
        lines.push("");
        prevListItem = undefined;
      }

      // Handle styles
      switch (b.style) {
        case "h1":
          lines.push(`# ${text}`);
          break;
        case "h2":
          lines.push(`## ${text}`);
          break;
        case "h3":
          lines.push(`### ${text}`);
          break;
        case "h4":
          lines.push(`#### ${text}`);
          break;
        case "blockquote":
          lines.push(`> ${text}`);
          break;
        default:
          lines.push(text);
      }
      lines.push("");
    }
  }

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---------------------------------------------------------------------------
// FAQ section
// ---------------------------------------------------------------------------

function faqToMarkdown(
  faq: { question: string; answer?: PortableTextBlock[] }[]
): string {
  if (!faq || faq.length === 0) return "";

  const lines: string[] = ["## FAQ", ""];
  for (const item of faq) {
    lines.push(`### ${item.question}`);
    lines.push("");
    if (item.answer) {
      lines.push(portableTextToMarkdown(item.answer));
      lines.push("");
    }
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Frontmatter generation
// ---------------------------------------------------------------------------

function generateFrontmatter(post: BlogPost, baseUrl: string): string {
  const tags = (post.tags || [])
    .slice(0, 4) // dev.to max 4 tags
    .map((t) => t.label.toLowerCase().replace(/[^a-z0-9]/g, ""));

  const coverImage =
    (post.mainImage ? sanityImageUrl(post.mainImage) : null) ||
    post.imageURL ||
    "";

  const canonicalUrl = `${baseUrl}/blog/${post.slug.current}`;

  const lines = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `published: false`,
    `description: "${(post.excerpt || "").replace(/"/g, '\\"')}"`,
    `tags: ${tags.join(", ")}`,
  ];

  if (coverImage) {
    lines.push(`cover_image: ${coverImage}`);
  }

  lines.push(`canonical_url: ${canonicalUrl}`);
  lines.push("---");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function listSlugs(): Promise<void> {
  const posts = await client.fetch<
    { slug: { current: string }; title: string }[]
  >(`*[_type == "blogPost"] | order(publishedAt desc) { title, slug }`);
  console.log("\nAvailable blog posts:\n");
  for (const p of posts) {
    console.log(`  ${p.slug.current}  -  ${p.title}`);
  }
  console.log("");
}

async function exportPost(slug: string): Promise<void> {
  const post = await client.fetch<BlogPost | null>(
    `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      publishedAt,
      mainImage,
      "imageURL": select(
        defined(mainImage) => mainImage.asset->url,
        imageURL
      ),
      excerpt,
      body[]{
        ...,
        _type == "image" => {
          ...,
          "asset": asset->{"_ref": _id, url}
        }
      },
      "tags": tags[]->{
        _id,
        label
      },
      author,
      faq
    }`,
    { slug }
  );

  if (!post) {
    console.error(`No blog post found with slug: "${slug}"`);
    console.log("Run with --list to see available slugs.");
    process.exit(1);
  }

  // Always use production URL for dev.to exports (ignore local .env.local value)
  const baseUrl = "https://www.sanderdesnaijer.com";

  // Build the markdown
  const frontmatter = generateFrontmatter(post, baseUrl);
  const bodyMd = post.body ? portableTextToMarkdown(post.body) : "";
  const faqMd = post.faq ? faqToMarkdown(post.faq) : "";

  const canonicalUrl = `${baseUrl}/blog/${post.slug.current}`;
  const originallyPosted = `---\n\n*Originally posted on [sanderdesnaijer.com](${canonicalUrl})*`;

  const parts = [frontmatter, "", bodyMd];
  if (faqMd) {
    parts.push("", "---", "", faqMd);
  }
  parts.push("", originallyPosted);

  const markdown = parts.join("\n") + "\n";

  // Write to file
  const outDir = path.join(__dirname, "devto-exports");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outFile, markdown, "utf-8");

  console.log(`\nExported: ${outFile}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Open ${outFile} and review the content`);
  console.log(`  2. Go to https://dev.to/new and paste the markdown`);
  console.log(`  3. Set "published: true" in the frontmatter when ready`);
  console.log(``);
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes("--list") || args.length === 0) {
  listSlugs().catch(console.error);
} else {
  const slug = args[0];
  exportPost(slug).catch(console.error);
}
