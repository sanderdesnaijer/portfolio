import { AUTHOR_NAME } from "@/app/utils/constants";
import { expect } from "@playwright/test";

/**
 * Helper function to test if metadata exists on a page.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {Object} expectedMeta - Expected metadata values.
 */
export async function testPageMetadata(
  page: import("@playwright/test").Page,
  expectedMeta: {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    imageAlt?: string;
    publishedTime: string;
    modifiedTime: string;
  }
) {
  // Title
  await expect(page).toHaveTitle(expectedMeta.title);

  // Description
  const metaDescription = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(metaDescription).toBe(expectedMeta.description);

  // Author
  const metaAuthor = await page
    .locator('meta[name="author"]')
    .getAttribute("content");
  expect(metaAuthor).toBe(AUTHOR_NAME);

  // Canonical URL
  if (expectedMeta.url) {
    const canonicalLink = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonicalLink).toBe(expectedMeta.url);
  }

  // Open Graph metadata
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    expectedMeta.title
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    expectedMeta.description
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    expectedMeta.url
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_US"
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    expectedMeta.imageUrl
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200"
  );
  await expect(
    page.locator('meta[property="og:image:height"]')
  ).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    expectedMeta.imageAlt || expectedMeta.title
  );
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
    "content",
    "image/png"
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article"
  );
  await expect(
    page.locator('meta[property="article:published_time"]')
  ).toHaveAttribute("content", expectedMeta.publishedTime);
  await expect(
    page.locator('meta[property="article:modified_time"]')
  ).toHaveAttribute("content", expectedMeta.modifiedTime);

  // Twitter metadata
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  );
  await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute(
    "content",
    AUTHOR_NAME
  );
  await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
    "content",
    "@sanderdesnaijer"
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    expectedMeta.title
  );
  await expect(
    page.locator('meta[name="twitter:description"]')
  ).toHaveAttribute("content", expectedMeta.description);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    expectedMeta.imageUrl
  );
  await expect(
    page.locator('meta[name="twitter:image:width"]')
  ).toHaveAttribute("content", "1200");
  await expect(
    page.locator('meta[name="twitter:image:height"]')
  ).toHaveAttribute("content", "675");
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    "content",
    expectedMeta.imageAlt || expectedMeta.title
  );
}
