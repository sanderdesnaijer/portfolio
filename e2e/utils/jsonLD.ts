/*
 * Helper function to validate the presence and structure of JSON-LD data in a webpage.
 * It checks for a script tag with type 'application/ld+json' and compares its content with the expected JSON-LD schema.
 *
 * @param page - Playwright Page object representing the webpage to test.
 * @param expectedJsonLd - The expected JSON-LD object that the page should contain.
 * @param options.strictMatch - When false, only validates structure (context, type, url) and skips deep content comparison. Useful when page data (SSG) may differ from API data (runtime).
 */

import { Page, expect } from "@playwright/test";

export async function validateJsonLd(
  page: Page,
  expectedJsonLd: Record<string, unknown>,
  options?: { strictMatch?: boolean }
) {
  const jsonLdHandle = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdHandle).toHaveCount(1);

  const jsonLdText = await jsonLdHandle.textContent();
  expect(jsonLdText).not.toBeNull();

  const parsedJsonLd = JSON.parse(jsonLdText!);

  if (options?.strictMatch === false) {
    // Structure-only validation: check top-level schema and that hasPart exists
    expect(parsedJsonLd["@context"]).toBe(expectedJsonLd["@context"]);
    expect(parsedJsonLd["@type"]).toBe(expectedJsonLd["@type"]);
    expect(parsedJsonLd.name).toBe(expectedJsonLd.name);
    expect(parsedJsonLd.url).toBe(expectedJsonLd.url);
    expect(Array.isArray(parsedJsonLd.hasPart)).toBe(true);
    expect(parsedJsonLd.hasPart.length).toBeGreaterThan(0);
  } else {
    expect(parsedJsonLd).toMatchObject(expectedJsonLd);
  }

  return parsedJsonLd;
}
