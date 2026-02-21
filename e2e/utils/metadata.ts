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
    canonical?: string;
  }
) {
  // Title
  await expect(page).toHaveTitle(expectedMeta.title);

  // Description
  const metaDescription = await page
    .locator('head meta[name="description"]')
    .getAttribute("content");
  expect(metaDescription).toBe(expectedMeta.description);

  // Author
  const metaAuthor = await page
    .locator('head meta[name="author"]')
    .getAttribute("content");
  expect(metaAuthor).toBe(AUTHOR_NAME);

  // Canonical URL
  if (expectedMeta.canonical || expectedMeta.url) {
    const canonicalLink = await page
      .locator('head link[rel="canonical"]')
      .getAttribute("href");
    expect(canonicalLink).toBe(expectedMeta.canonical || expectedMeta.url);
  }

  // Open Graph metadata
  await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
    "content",
    expectedMeta.title
  );
  await expect(
    page.locator('head meta[property="og:description"]')
  ).toHaveAttribute("content", expectedMeta.description);
  await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
    "content",
    expectedMeta.url
  );
  await expect(page.locator('head meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_US"
  );
  await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
    "content",
    expectedMeta.imageUrl
  );
  await expect(
    page.locator('head meta[property="og:image:width"]')
  ).toHaveAttribute("content", "1200");
  await expect(
    page.locator('head meta[property="og:image:height"]')
  ).toHaveAttribute("content", "630");
  await expect(
    page.locator('head meta[property="og:image:alt"]')
  ).toHaveAttribute("content", expectedMeta.imageAlt || expectedMeta.title);
  await expect(
    page.locator('head meta[property="og:image:type"]')
  ).toHaveAttribute("content", "image/png");
  await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article"
  );
  await expect(
    page.locator('head meta[property="article:published_time"]')
  ).toHaveAttribute("content", expectedMeta.publishedTime);
  await expect(
    page.locator('head meta[property="article:modified_time"]')
  ).toHaveAttribute("content", expectedMeta.modifiedTime);

  // Twitter metadata
  await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  );
  await expect(page.locator('head meta[name="twitter:site"]')).toHaveAttribute(
    "content",
    AUTHOR_NAME
  );
  await expect(
    page.locator('head meta[name="twitter:creator"]')
  ).toHaveAttribute("content", "@sanderdesnaijer");
  await expect(page.locator('head meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    expectedMeta.title
  );
  await expect(
    page.locator('head meta[name="twitter:description"]')
  ).toHaveAttribute("content", expectedMeta.description);
  await expect(page.locator('head meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    expectedMeta.imageUrl
  );
  await expect(
    page.locator('head meta[name="twitter:image:width"]')
  ).toHaveAttribute("content", "1200");
  await expect(
    page.locator('head meta[name="twitter:image:height"]')
  ).toHaveAttribute("content", "675");
  await expect(
    page.locator('head meta[name="twitter:image:alt"]')
  ).toHaveAttribute("content", expectedMeta.imageAlt || expectedMeta.title);

  // Favicons
  const favicons = [
    {
      url: "/meta/light/favicon-16x16.png",
      media: "(prefers-color-scheme: light)",
      sizes: "16x16",
    },
    {
      url: "/meta/dark/favicon-16x16.png",
      media: "(prefers-color-scheme: dark)",
      sizes: "16x16",
    },
    {
      url: "/meta/light/favicon-32x32.png",
      media: "(prefers-color-scheme: light)",
      sizes: "32x32",
    },
    {
      url: "/meta/dark/favicon-32x32.png",
      media: "(prefers-color-scheme: dark)",
      sizes: "32x32",
    },
  ];

  for (const { url, media, sizes } of favicons) {
    const locator = page.locator(`head link[rel="icon"][href="${url}"]`);
    await expect(locator).toHaveAttribute("sizes", sizes);
    await expect(locator).toHaveAttribute("media", media);
  }

  // Shortcut Icons
  const shortcutIcons = [
    {
      url: "/meta/light/favicon-32x32.png",
      media: "(prefers-color-scheme: light)",
      sizes: "32x32",
    },
    {
      url: "/meta/dark/favicon-32x32.png",
      media: "(prefers-color-scheme: dark)",
      sizes: "32x32",
    },
  ];

  for (const { url, media, sizes } of shortcutIcons) {
    const locator = page.locator(
      `head link[rel="shortcut icon"][href="${url}"]`
    );
    await expect(locator).toHaveAttribute("sizes", sizes);
    await expect(locator).toHaveAttribute("media", media);
  }

  // Apple Touch Icons
  const appleIcons = [
    {
      url: "/meta/light/apple-icon.png",
      sizes: "72x72",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/meta/dark/apple-icon.png",
      sizes: "72x72",
      media: "(prefers-color-scheme: dark)",
    },
    {
      url: "/meta/light/apple-icon@2x.png",
      sizes: "144x144",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/meta/dark/apple-icon@2x.png",
      sizes: "144x144",
      media: "(prefers-color-scheme: dark)",
    },
    {
      url: "/meta/light/apple-icon@3x.png",
      sizes: "216x216",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/meta/dark/apple-icon@3x.png",
      sizes: "216x216",
      media: "(prefers-color-scheme: dark)",
    },
  ];

  for (const { url, sizes, media } of appleIcons) {
    const locator = page.locator(
      `head link[rel="apple-touch-icon"][href="${url}"]`
    );
    await expect(locator).toHaveAttribute("sizes", sizes);
    await expect(locator).toHaveAttribute("media", media);
  }

  // Apple Touch Icon Precomposed
  await expect(
    page.locator(
      'head link[rel="apple-touch-icon-precomposed"][href="/meta/light/apple-touch-icon.png"]'
    )
  ).toHaveAttribute("media", "(prefers-color-scheme: light)");
  await expect(
    page.locator(
      'head link[rel="apple-touch-icon-precomposed"][href="/meta/dark/apple-touch-icon.png"]'
    )
  ).toHaveAttribute("media", "(prefers-color-scheme: dark)");
}
