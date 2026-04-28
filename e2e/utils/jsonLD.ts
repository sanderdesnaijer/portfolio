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
): Promise<Record<string, any>> {
  const jsonLdHandles = page.locator('script[type="application/ld+json"]');
  const count = await jsonLdHandles.count();
  expect(count).toBeGreaterThan(0);

  const expectedType = expectedJsonLd["@type"];
  let matched: Record<string, any> | undefined;
  for (let i = 0; i < count; i++) {
    const text = await jsonLdHandles.nth(i).textContent();
    expect(text).not.toBeNull();
    const parsed = JSON.parse(text!);
    if (parsed["@type"] === expectedType) {
      matched = parsed;
      break;
    }
  }
  if (!matched) {
    throw new Error(
      `No JSON-LD script with @type="${String(expectedType)}" found on page`
    );
  }
  const parsedJsonLd: Record<string, any> = matched;

  if (options?.strictMatch === false) {
    // Structure-only validation: check top-level schema and that items array exists
    expect(parsedJsonLd["@context"]).toBe(expectedJsonLd["@context"]);
    expect(parsedJsonLd["@type"]).toBe(expectedJsonLd["@type"]);
    expect(parsedJsonLd.name).toBe(expectedJsonLd.name);
    expect(parsedJsonLd.url).toBe(expectedJsonLd.url);
    const itemsKey =
      "blogPost" in (parsedJsonLd as object) ? "blogPost" : "hasPart";
    const items = parsedJsonLd[itemsKey];
    expect(Array.isArray(items)).toBe(true);
    expect((items as unknown[]).length).toBeGreaterThan(0);
  } else {
    expect(parsedJsonLd).toMatchObject(expectedJsonLd);
  }

  return parsedJsonLd;
}
