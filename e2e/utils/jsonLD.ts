/*
 * Helper function to validate the presence and structure of JSON-LD data in a webpage.
 * It checks for a script tag with type 'application/ld+json' and compares its content with the expected JSON-LD schema.
 *
 * @param page - Playwright Page object representing the webpage to test.
 * @param expectedJsonLd - The expected JSON-LD object that the page should contain.
 */

import { Page, expect } from "@playwright/test";

export async function validateJsonLd(
  page: Page,
  expectedJsonLd: Record<string, unknown>
) {
  const jsonLdHandle = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdHandle).toHaveCount(1);

  const jsonLdText = await jsonLdHandle.textContent();
  expect(jsonLdText).not.toBeNull();

  const parsedJsonLd = JSON.parse(jsonLdText!);
  expect(parsedJsonLd.value).toMatchObject(expectedJsonLd);
}
