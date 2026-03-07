/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
/**
 * Migration script: Convert Medium HTML blog posts to native Sanity Portable Text documents.
 *
 * Downloads all images from Medium CDN, converts to WebP, uploads to Sanity,
 * then converts HTML content to Portable Text with Sanity image references.
 *
 * Usage:
 *   npm run migrate:medium-to-sanity
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";
import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.NEXT_PUBLIC_SANITY_TOKEN!;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-24",
  useCdn: false,
});

const defaultSchema = Schema.compile({
  name: "default",
  types: [
    {
      name: "blockContent",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [{ title: "URL", name: "href", type: "url" }],
              },
            ],
          },
        },
      ],
    },
  ],
});

interface BlogPost {
  _id: string;
  title: string;
  description?: string;
  body?: any[];
  imageURL?: string;
  slug: { current: string };
}

const DELAY_BETWEEN_IMAGES_MS = 3000;
const MAX_RETRIES = 5;
const DELAY_BETWEEN_POSTS_MS = 5000;

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rewriteMediumImageUrl(url: string): string {
  return url.replace(
    /https:\/\/cdn-images-\d+\.medium\.com\/max\/(\d+)\//,
    "https://miro.medium.com/v2/resize:fit:$1/"
  );
}

async function downloadAndUploadImage(
  imageUrl: string,
  filename: string
): Promise<{ _type: "reference"; _ref: string } | null> {
  if (!imageUrl || imageUrl.length < 10) return null;
  if (imageUrl.includes("medium.com/_/stat")) return null;

  const url = rewriteMediumImageUrl(imageUrl);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `    Downloading (attempt ${attempt}): ${url.substring(0, 80)}...`
      );
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (response.status === 429) {
        const retryDelay = attempt * 5000;
        console.warn(
          `    Rate limited (429). Waiting ${retryDelay / 1000}s before retry...`
        );
        await sleep(retryDelay);
        continue;
      }

      if (!response.ok) {
        console.warn(`    Failed (${response.status}): ${imageUrl}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      if (inputBuffer.length === 0) {
        console.warn(`    Empty image, skipping`);
        return null;
      }

      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 })
        .toBuffer();

      console.log(
        `    Converted: ${(inputBuffer.length / 1024).toFixed(0)}KB → ${(webpBuffer.length / 1024).toFixed(0)}KB WebP`
      );

      const asset = await client.assets.upload("image", webpBuffer, {
        filename: `${filename}.webp`,
        contentType: "image/webp",
      });

      console.log(`    Uploaded: ${asset._id}`);
      return { _type: "reference", _ref: asset._id };
    } catch (err: any) {
      console.warn(`    Error (attempt ${attempt}): ${err.message}`);
      if (attempt < MAX_RETRIES) {
        await sleep(attempt * 3000);
      }
    }
  }

  console.warn(`    Gave up after ${MAX_RETRIES} attempts: ${url}`);
  return null;
}

function extractExcerpt(html: string, maxLength = 200): string {
  const withoutFigcaptions = html.replace(
    /<figcaption>[^]*?<\/figcaption>/g,
    ""
  );
  const text = withoutFigcaptions.replace(/<[^>]*>/g, " ");
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > maxLength
    ? clean.substring(0, maxLength) + "..."
    : clean;
}

interface ImageInfo {
  src: string;
  alt: string;
}

function extractImagesFromHTML(html: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  const figureRegex = /<figure[^>]*>([\s\S]*?)<\/figure>/g;
  let figMatch;
  while ((figMatch = figureRegex.exec(html)) !== null) {
    const figureContent = figMatch[1];
    const imgMatch = figureContent.match(
      /<img[^>]+src="([^">]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/
    );
    if (!imgMatch) continue;
    const src = imgMatch[1];
    if (
      !src ||
      !src.startsWith("http") ||
      src.length <= 10 ||
      src.includes("medium.com/_/stat")
    )
      continue;

    const captionMatch = figureContent.match(
      /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/
    );
    const caption = captionMatch
      ? captionMatch[1].replace(/<[^>]*>/g, "").trim()
      : "";
    const alt = caption || imgMatch[2] || "";

    images.push({ src, alt });
  }

  const standaloneImgRegex =
    /<img[^>]+src="([^">]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/g;
  let imgMatch;
  const figureSources = new Set(images.map((i) => i.src));
  while ((imgMatch = standaloneImgRegex.exec(html)) !== null) {
    const src = imgMatch[1];
    if (
      src &&
      src.startsWith("http") &&
      src.length > 10 &&
      !src.includes("medium.com/_/stat") &&
      !figureSources.has(src)
    ) {
      images.push({ src, alt: imgMatch[2] || "" });
    }
  }

  return images;
}

function stripImagesFromHTML(html: string): string {
  return html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "<p>__IMG_PLACEHOLDER__</p>")
    .replace(/<img[^>]*>/g, "<p>__IMG_PLACEHOLDER__</p>");
}

interface CodeSnippet {
  code: string;
  language?: string;
}

function extractCodeBlocks(html: string): {
  stripped: string;
  codeBlocks: CodeSnippet[];
} {
  const codeBlocks: CodeSnippet[] = [];
  const stripped = html.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/g,
    (_match, inner: string) => {
      const codeMatch = inner.match(
        /<code[^>]*(?:class="[^"]*language-(\w+)[^"]*")?[^>]*>([\s\S]*?)<\/code>/
      );
      let code: string;
      let language: string | undefined;

      if (codeMatch) {
        language = codeMatch[1];
        code = codeMatch[2];
      } else {
        code = inner;
      }

      code = code
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();

      if (code) {
        codeBlocks.push({ code, language });
      }
      return "<p>__CODE_PLACEHOLDER__</p>";
    }
  );
  return { stripped, codeBlocks };
}

async function convertPost(
  post: BlogPost
): Promise<{ body: any[]; excerpt: string; mainImageRef: any | null }> {
  const html = post.description!;
  const images = extractImagesFromHTML(html);

  console.log(`  Found ${images.length} images in HTML.`);

  const existingImageRefs: { _type: "reference"; _ref: string }[] = [];
  const existingImageAlts: string[] = [];
  if (post.body) {
    for (const block of post.body) {
      if (block._type === "image" && block.asset?._ref) {
        existingImageRefs.push({ _type: "reference", _ref: block.asset._ref });
        existingImageAlts.push(block.alt || "");
      }
    }
  }

  const uploadedImages: Map<
    number,
    { ref: { _type: "reference"; _ref: string }; alt: string }
  > = new Map();

  if (
    existingImageRefs.length >= images.length &&
    existingImageRefs.length > 0
  ) {
    console.log(
      `  Reusing ${existingImageRefs.length} existing image assets from Sanity.`
    );
    for (let i = 0; i < images.length; i++) {
      uploadedImages.set(i, {
        ref: existingImageRefs[i],
        alt: images[i].alt || existingImageAlts[i] || "",
      });
    }
  } else {
    for (let i = 0; i < images.length; i++) {
      if (i < existingImageRefs.length) {
        uploadedImages.set(i, {
          ref: existingImageRefs[i],
          alt: images[i].alt || existingImageAlts[i] || "",
        });
        console.log(`    Reusing existing asset: ${existingImageRefs[i]._ref}`);
      } else {
        const img = images[i];
        const ref = await downloadAndUploadImage(
          img.src,
          `${post.slug.current}-${i}`
        );
        if (ref) {
          uploadedImages.set(i, { ref, alt: img.alt });
        }
      }
      if (i < images.length - 1) {
        await sleep(DELAY_BETWEEN_IMAGES_MS);
      }
    }
  }

  let mainImageRef: { _type: "reference"; _ref: string } | null = null;
  if (uploadedImages.size > 0) {
    const first = uploadedImages.values().next().value;
    if (first) mainImageRef = first.ref;
  }

  console.log(`  Converting HTML to Portable Text (text only)...`);
  const { stripped: codeStrippedHtml, codeBlocks } = extractCodeBlocks(html);
  console.log(`  Found ${codeBlocks.length} code blocks in HTML.`);
  const strippedHtml = stripImagesFromHTML(codeStrippedHtml);

  const blockContentSchema = defaultSchema.get("blockContent");
  const textBlocks = htmlToBlocks(strippedHtml, blockContentSchema, {
    parseHtml: (h: string) => new JSDOM(h).window.document,
  });

  console.log(`  Got ${textBlocks.length} text blocks.`);

  const finalBlocks: any[] = [];
  let imageIndex = 0;
  let codeIndex = 0;

  for (const block of textBlocks) {
    const children = block.children as any[] | undefined;
    const text = children?.map((c: any) => c.text || "").join("") || "";
    const trimmedText = text.trim();

    if (
      trimmedText === "__IMG_PLACEHOLDER__" &&
      uploadedImages.has(imageIndex)
    ) {
      const img = uploadedImages.get(imageIndex)!;
      finalBlocks.push({
        _type: "image",
        _key: randomKey(),
        asset: img.ref,
        alt: img.alt,
      });
      imageIndex++;
    } else if (trimmedText === "__IMG_PLACEHOLDER__") {
      imageIndex++;
    } else if (
      trimmedText === "__CODE_PLACEHOLDER__" &&
      codeIndex < codeBlocks.length
    ) {
      const snippet = codeBlocks[codeIndex];
      finalBlocks.push({
        _type: "codeBlock",
        _key: randomKey(),
        code: snippet.code,
        language: snippet.language || undefined,
      });
      codeIndex++;
    } else if (
      text.includes("__CODE_PLACEHOLDER__") ||
      text.includes("__IMG_PLACEHOLDER__")
    ) {
      const placeholderRegex = /__(?:CODE|IMG)_PLACEHOLDER__/g;
      let match;
      let cursor = 0;

      while ((match = placeholderRegex.exec(text)) !== null) {
        const before = text.substring(cursor, match.index).trim();
        if (before) {
          finalBlocks.push({
            ...block,
            _key: randomKey(),
            children: [
              { _type: "span", _key: randomKey(), text: before, marks: [] },
            ],
          });
        }

        if (
          match[0] === "__CODE_PLACEHOLDER__" &&
          codeIndex < codeBlocks.length
        ) {
          const snippet = codeBlocks[codeIndex];
          finalBlocks.push({
            _type: "codeBlock",
            _key: randomKey(),
            code: snippet.code,
            language: snippet.language || undefined,
          });
          codeIndex++;
        } else if (
          match[0] === "__IMG_PLACEHOLDER__" &&
          uploadedImages.has(imageIndex)
        ) {
          const img = uploadedImages.get(imageIndex)!;
          finalBlocks.push({
            _type: "image",
            _key: randomKey(),
            asset: img.ref,
            alt: img.alt,
          });
          imageIndex++;
        } else if (match[0] === "__IMG_PLACEHOLDER__") {
          imageIndex++;
        }

        cursor = match.index + match[0].length;
      }

      const remaining = text.substring(cursor).trim();
      if (remaining) {
        finalBlocks.push({
          ...block,
          _key: randomKey(),
          children: [
            { _type: "span", _key: randomKey(), text: remaining, marks: [] },
          ],
        });
      }
    } else {
      finalBlocks.push(block);
    }
  }

  while (imageIndex < images.length) {
    const img = uploadedImages.get(imageIndex);
    if (img) {
      finalBlocks.push({
        _type: "image",
        _key: randomKey(),
        asset: img.ref,
        alt: img.alt,
      });
    }
    imageIndex++;
  }

  while (codeIndex < codeBlocks.length) {
    const snippet = codeBlocks[codeIndex];
    finalBlocks.push({
      _type: "codeBlock",
      _key: randomKey(),
      code: snippet.code,
      language: snippet.language || undefined,
    });
    codeIndex++;
  }

  const excerpt = extractExcerpt(html);

  return { body: finalBlocks, excerpt, mainImageRef };
}

async function migrate() {
  console.log("Connecting to Sanity...");
  console.log(`  Project: ${projectId}, Dataset: ${dataset}\n`);

  const allPosts = await client.fetch<BlogPost[]>(
    `*[_type == "blogPost"]{ _id, title, description, body, imageURL, slug }`
  );

  console.log(`Found ${allPosts.length} total blogPost documents.\n`);

  if (allPosts.length === 0) {
    console.log("No blogPost documents found.");
    return;
  }

  const forceRemigrate = process.argv.includes("--force");

  const postsToMigrate = allPosts.filter((post) => {
    if (!post.description) return false;
    if (forceRemigrate) return true;
    if (!post.body) return true;

    const hasImages = post.body.some((b: any) => b._type === "image");
    if (!hasImages) {
      const htmlImages = extractImagesFromHTML(post.description);
      if (htmlImages.length > 0) return true;
    }

    const hasCodeBlocks = post.body.some((b: any) => b._type === "codeBlock");
    if (!hasCodeBlocks) {
      const htmlHasCode = /<pre[^>]*>[\s\S]*?<\/pre>/.test(post.description);
      if (htmlHasCode) return true;
    }

    return false;
  });

  console.log(`${postsToMigrate.length} posts need migration:`);
  for (const post of postsToMigrate) {
    console.log(`  - "${post.title}"`);
  }

  if (postsToMigrate.length === 0) {
    console.log("\nAll posts already migrated.");
    return;
  }

  console.log("");

  let success = 0;
  let failed = 0;

  for (const post of postsToMigrate) {
    console.log(`━━━ Migrating: "${post.title}" (${post._id}) ━━━`);

    try {
      const { body, excerpt, mainImageRef } = await convertPost(post);

      const patch: Record<string, any> = { body, excerpt };

      if (mainImageRef) {
        patch.mainImage = {
          _type: "image",
          asset: mainImageRef,
        };
      }

      console.log(`  Saving ${body.length} blocks to Sanity...`);
      await client.patch(post._id).set(patch).commit();

      console.log(`  ✓ Done!\n`);
      success++;
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}\n`);
      failed++;
    }

    if (postsToMigrate.indexOf(post) < postsToMigrate.length - 1) {
      console.log(
        `  Waiting ${DELAY_BETWEEN_POSTS_MS / 1000}s before next post...\n`
      );
      await sleep(DELAY_BETWEEN_POSTS_MS);
    }
  }

  console.log(
    `\n━━━ Migration complete! ${success} succeeded, ${failed} failed. ━━━`
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
