import { Page } from "@playwright/test";

/**
 * Block external image requests from Medium CDN to prevent 429 rate limit errors during tests.
 * This should be called before navigating to pages that contain Medium images.
 */
export async function blockExternalImages(page: Page) {
  await page.route("**/cdn-images-1.medium.com/**", (route) => {
    // Return a 1x1 transparent PNG placeholder
    const transparentPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: transparentPng,
    });
  });
}
