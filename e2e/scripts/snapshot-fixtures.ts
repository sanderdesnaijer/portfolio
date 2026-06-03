/**
 * Snapshot current Sanity production data as JSON fixtures for e2e tests.
 *
 * Usage:
 *   npx tsx e2e/scripts/snapshot-fixtures.ts
 *   npx tsx e2e/scripts/snapshot-fixtures.ts --dry-run
 *
 * Outputs JSON files to e2e/fixtures/ that are committed to the repo.
 * Re-run whenever you publish new content and want e2e to reflect it.
 */

import { createClient } from "@sanity/client";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../../.env.local") });

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

const isDryRun = process.argv.includes("--dry-run");
const fixturesDir = resolve(__dirname, "../fixtures");

/** Queries are supersets of those in sanity/lib/queries.ts (extra fields are harmless) */
const queries: Record<
  string,
  { query: string; params?: Record<string, unknown> }
> = {
  pages: {
    query: `*[_type == "pages"] | order(order asc) {
      _id, title, description, _createdAt, _updatedAt, slug, content, name, order,
      navigationLocation, "imageURL": mainImage.asset->url,
      seoTitleBase, disableBrandTitleSuffix, body,
      "imageAlt": mainImage.alt
    }`,
  },
  settings: {
    query: `*[_type == "setting"][0]{
      _id, title, description,
      socialMedia[]{ title, link, icon },
      "imageURL": mainImage.asset->url,
      "imageAlt": mainImage.alt
    }`,
  },
  projects: {
    query: `*[_type == "project"] | order(publishedAt desc){
      publishedAt, _createdAt, _updatedAt, _id, title, slug, mainImage, body, excerpt,
      "imageURL": mainImage.asset->url,
      "imageAlt": mainImage.alt,
      "tags": tags[]->{ _id, label },
      links, faq,
      "companyName": job->companyName,
      "companyLogo": job->logo.asset->url,
      jsonLdType, jsonLdApplicationCategory, jsonLdOperatingSystem,
      jsonLdCodeRepository, jsonLdProgrammingLanguage, jsonLdDownloadUrl, jsonLdIsAuthor,
      description
    }`,
  },
  blogs: {
    query: `*[_type == "blogPost"] | order(publishedAt desc) {
      _id, _createdAt, _updatedAt, title, slug, publishedAt, mainImage,
      "imageURL": select(
        defined(mainImage) => mainImage.asset->url + "?w=1200&h=630&fit=crop&auto=format",
        imageURL
      ),
      excerpt, body, links, faq, description,
      "tags": tags[]->{ _id, label },
      author, mediumUrl
    }`,
  },
  jobs: {
    query: `*[_type == "job"] | order(startDate desc){
      _id, companyName, jobTitle, startDate, endDate, link, description,
      "tags": tags[]->{ _id, label },
      "imageURL": logo.asset->url,
      employmentType,
      "contractName": contractName->companyName
    }`,
  },
  tags: {
    query: `*[_type == "tag"] | order(label asc) {
      _id, _type, _createdAt, _updatedAt, _rev, label, slug, metaDescription, intro
    }`,
  },
};

async function snapshot() {
  console.log(
    isDryRun ? "[DRY RUN] Would write fixtures:" : "Snapshotting fixtures..."
  );

  mkdirSync(fixturesDir, { recursive: true });

  for (const [name, { query, params }] of Object.entries(queries)) {
    try {
      const data = await client.fetch(query, params ?? {});
      const filePath = resolve(fixturesDir, `${name}.json`);

      if (isDryRun) {
        const count = Array.isArray(data) ? data.length : data ? 1 : 0;
        console.log(`  ${name}.json: ${count} item(s)`);
      } else {
        writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
        const count = Array.isArray(data) ? data.length : data ? 1 : 0;
        console.log(`  wrote ${name}.json (${count} item(s))`);
      }
    } catch (err) {
      console.error(`  FAILED ${name}:`, err);
      process.exit(1);
    }
  }

  if (!isDryRun) {
    // Write an index file for easy imports
    const indexContent =
      Object.keys(queries)
        .map((name) => `export { default as ${name} } from "./${name}.json";`)
        .join("\n") + "\n";
    writeFileSync(resolve(fixturesDir, "index.ts"), indexContent);
    console.log("  wrote index.ts");
  }

  console.log("Done.");
}

snapshot();
