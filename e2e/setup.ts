import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("**.sanity", (route, request) => {
      // Mock the response for the sanityFetch call
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          // Your mock data here
        }),
      });
    });
    await use(page);
  },
});
