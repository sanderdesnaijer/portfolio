import { sanityFetch } from "@/sanity/lib/fetch";
import envConfig from "@/envConfig";

export const revalidate = 86400; // 24 hours

// ---------------------------------------------------------------------------
// Types (subset of the blog body Portable Text shapes)
// ---------------------------------------------------------------------------

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface Span {
  _type: "span";
  text: string;
  marks?: string[];
}

interface Block {
  _type: "block";
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
  asset?: { url?: string };
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

interface FeedPost {
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  imageURL?: string;
  body?: PortableTextBlock[];
  author?: string;
  tags?: { label: string }[];
}

// ---------------------------------------------------------------------------
// HTML / XML escaping helpers
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// CDATA is safe for arbitrary HTML except a literal "]]>" sequence.
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

// Best-effort enclosure MIME type from the image URL extension. Sanity CDN URLs
// end in the real extension (.webp/.png/...), optionally with a query string.
function imageMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

// ---------------------------------------------------------------------------
// Portable Text -> HTML conversion (self-contained, server-side)
// ---------------------------------------------------------------------------

function spanToHtml(span: Span, markDefs: MarkDef[], baseUrl: string): string {
  let text = escapeHtml(span.text);
  if (!span.marks || span.marks.length === 0) return text;

  for (const mark of span.marks) {
    if (mark === "strong") {
      text = `<strong>${text}</strong>`;
    } else if (mark === "em") {
      text = `<em>${text}</em>`;
    } else if (mark === "code") {
      text = `<code>${text}</code>`;
    } else {
      const def = markDefs.find((d) => d._key === mark);
      if (def && def._type === "link" && def.href) {
        const href = def.href.startsWith("/")
          ? `${baseUrl}${def.href}`
          : def.href;
        text = `<a href="${escapeXml(href)}">${text}</a>`;
      }
    }
  }

  return text;
}

function blockChildrenToHtml(block: Block, baseUrl: string): string {
  const markDefs = block.markDefs || [];
  return (block.children || [])
    .map((child) => spanToHtml(child, markDefs, baseUrl))
    .join("");
}

function portableTextToHtml(
  blocks: PortableTextBlock[],
  baseUrl: string
): string {
  const out: string[] = [];

  // Buffer for grouping consecutive list items into a single <ul>/<ol>.
  let listType: "bullet" | "number" | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (listType && listItems.length) {
      const tag = listType === "bullet" ? "ul" : "ol";
      out.push(`<${tag}>${listItems.join("")}</${tag}>`);
    }
    listType = null;
    listItems = [];
  };

  for (const block of blocks) {
    if (block._type === "codeBlock") {
      flushList();
      const cb = block as CodeBlock;
      const langClass = cb.language ? ` class="language-${cb.language}"` : "";
      out.push(`<pre><code${langClass}>${escapeHtml(cb.code)}</code></pre>`);
      continue;
    }

    if (block._type === "youTube") {
      flushList();
      const yt = block as YouTubeBlock;
      // A bare URL on its own line is the Medium-style embed convention that
      // HackerNoon's importer recognizes and auto-embeds.
      if (yt.url) out.push(`<p>${escapeXml(yt.url)}</p>`);
      continue;
    }

    if (block._type === "image") {
      flushList();
      const img = block as ImageBlock;
      const url = img.asset?.url;
      const alt = escapeXml(img.alt || "");
      if (url) {
        const caption = img.alt
          ? `<figcaption>${escapeHtml(img.alt)}</figcaption>`
          : "";
        out.push(
          `<figure><img src="${escapeXml(url)}" alt="${alt}" />${caption}</figure>`
        );
      }
      continue;
    }

    if (block._type === "table") {
      flushList();
      const tbl = block as TableBlock;
      if (tbl.headers && tbl.headers.length > 0) {
        const head = tbl.headers
          .map((h) => `<th>${escapeHtml(h)}</th>`)
          .join("");
        const rows = (tbl.rows || [])
          .map((row) => {
            const cells = row.cells || [];
            while (cells.length < tbl.headers!.length) cells.push("");
            return `<tr>${cells
              .map((c) => `<td>${escapeHtml(c)}</td>`)
              .join("")}</tr>`;
          })
          .join("");
        const caption = tbl.caption
          ? `<caption>${escapeHtml(tbl.caption)}</caption>`
          : "";
        out.push(
          `<table>${caption}<thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`
        );
      }
      continue;
    }

    if (block._type === "embed") {
      flushList();
      const emb = block as EmbedBlock;
      if (emb.type === "iframe" && emb.url) {
        out.push(`<p>${escapeXml(emb.url)}</p>`);
        if (emb.caption) out.push(`<p><em>${escapeHtml(emb.caption)}</em></p>`);
      } else if (emb.type === "component") {
        out.push(
          `<blockquote>Interactive component: ${escapeHtml(
            emb.componentId || "embedded content"
          )}${emb.caption ? ` - ${escapeHtml(emb.caption)}` : ""}</blockquote>`
        );
      }
      continue;
    }

    if (block._type === "block") {
      const b = block as Block;
      const inner = blockChildrenToHtml(b, baseUrl);

      if (b.listItem) {
        if (listType && listType !== b.listItem) flushList();
        listType = b.listItem;
        listItems.push(`<li>${inner}</li>`);
        continue;
      }

      flushList();

      switch (b.style) {
        case "h1":
          out.push(`<h1>${inner}</h1>`);
          break;
        case "h2":
          out.push(`<h2>${inner}</h2>`);
          break;
        case "h3":
          out.push(`<h3>${inner}</h3>`);
          break;
        case "h4":
          out.push(`<h4>${inner}</h4>`);
          break;
        case "blockquote":
          out.push(`<blockquote>${inner}</blockquote>`);
          break;
        default:
          if (inner.trim()) out.push(`<p>${inner}</p>`);
      }
    }
  }

  flushList();
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Feed query + route
// ---------------------------------------------------------------------------

// Cap to the most recent posts (RSS convention). Older posts remain importable
// on HackerNoon via "Import Story" -> Direct URL, so they don't need to be here.
const feedQuery = `*[_type == "blogPost"] | order(publishedAt desc) [0...20] {
  title,
  slug,
  publishedAt,
  excerpt,
  "imageURL": select(
    defined(mainImage) => mainImage.asset->url,
    imageURL
  ),
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{url}
    }
  },
  author,
  "tags": tags[]->{ label }
}`;

export async function GET() {
  const { baseUrl } = envConfig;
  const posts = await sanityFetch<FeedPost[]>({ query: feedQuery });

  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${baseUrl}/blog/${post.slug.current}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : buildDate;
      const contentHtml = post.body
        ? portableTextToHtml(post.body, baseUrl)
        : "";

      const categories = (post.tags || [])
        .map((t) => `    <category>${escapeXml(t.label)}</category>`)
        .join("\n");

      const enclosure = post.imageURL
        ? `    <enclosure url="${escapeXml(post.imageURL)}" type="${imageMimeType(post.imageURL)}" length="0" />\n`
        : "";

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${pubDate}</pubDate>
${post.author ? `    <dc:creator>${escapeXml(post.author)}</dc:creator>\n` : ""}    <description>${escapeXml(post.excerpt || "")}</description>
${enclosure}${categories ? `${categories}\n` : ""}    <content:encoded>${cdata(contentHtml)}</content:encoded>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Sander de Snaijer - Blog</title>
  <link>${escapeXml(baseUrl)}/blog</link>
  <atom:link href="${escapeXml(baseUrl)}/feed.xml" rel="self" type="application/rss+xml" />
  <description>Articles on MediaPipe, browser-based computer vision, React, and hardware projects by Sander de Snaijer.</description>
  <language>en</language>
  <lastBuildDate>${buildDate}</lastBuildDate>
${items}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
