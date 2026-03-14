import { test, expect, Page } from "@playwright/test";
import { runAccessibilityTest } from "../utils/accessibility";
import { mockConsent } from "../utils/localStorage";

async function checkTagsPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /Tags/i })
  ).toBeVisible();

  const tagLinks = page.getByRole("list").getByRole("link");
  expect(await tagLinks.count()).toBeGreaterThan(0);
}

test.describe("tags", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    await page.goto("/tags");
  });

  test("should display heading and tag links", async ({ page }) => {
    await checkTagsPageElements(page);
  });

  test("should navigate to a tag detail page", async ({ page }) => {
    const firstTag = page.getByRole("list").getByRole("link").first();
    const href = await firstTag.getAttribute("href");
    await firstTag.click();
    await expect(page).toHaveURL(href!);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should show tag-specific 404 for invalid tag", async ({ page }) => {
    await page.goto("/tags/this-tag-does-not-exist");

    await expect(
      page.getByRole("heading", { level: 1, name: /Tag not found/i })
    ).toBeVisible();

    const browseLink = page.getByRole("link", { name: /Browse all tags/i });
    await expect(browseLink).toBeVisible();
    expect(await browseLink.getAttribute("href")).toBe("/tags");
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });
});
