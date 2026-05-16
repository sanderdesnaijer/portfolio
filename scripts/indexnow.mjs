#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Submit URLs to IndexNow (Bing, Yandex, Naver, etc.)
 *
 * Usage:
 *   node scripts/indexnow.mjs                    # submit all known pages
 *   node scripts/indexnow.mjs https://sanderdesnaijer.com/blog/some-post  # submit specific URL(s)
 *
 * The script fetches your sitemap to discover all pages, then submits them
 * in a single batch request to the IndexNow API.
 */

const HOST = "sanderdesnaijer.com";
const KEY = "c73e0494895244bd890be15328b9ffb4";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

async function getUrlsFromSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();

  // Extract all <loc> URLs from sitemap (handles sitemap index too)
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    // If it's a nested sitemap, fetch that too
    if (url.endsWith(".xml")) {
      const nested = await fetch(url);
      if (nested.ok) {
        const nestedXml = await nested.text();
        let nestedMatch;
        const nestedRegex = /<loc>([^<]+)<\/loc>/g;
        while ((nestedMatch = nestedRegex.exec(nestedXml)) !== null) {
          urls.push(nestedMatch[1].trim());
        }
      }
    } else {
      urls.push(url);
    }
  }
  return urls;
}

async function submitUrls(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URLs to IndexNow...\n`);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`Done. Status: ${res.status} (${res.statusText})`);
    console.log(`Submitted ${urls.length} URLs.`);
  } else {
    const text = await res.text();
    console.error(`Failed. Status: ${res.status}`);
    console.error(text);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  let urls;

  if (args.length > 0) {
    // Submit specific URLs passed as arguments
    urls = args;
    console.log("Submitting provided URLs:");
  } else {
    // Fetch all URLs from sitemap
    console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
    urls = await getUrlsFromSitemap();
    console.log(`Found ${urls.length} URLs in sitemap.`);
  }

  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }

  // IndexNow accepts max 10,000 URLs per request
  const batchSize = 10000;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await submitUrls(batch);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
