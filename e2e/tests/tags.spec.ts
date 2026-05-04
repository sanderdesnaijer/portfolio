import { test, expect, Page } from "@playwright/test";
import { runAccessibilityTest } from "../utils/accessibility";
import { mockConsent } from "../utils/localStorage";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl } from "@/app/utils/utils";
import { AUTHOR_NAME } from "@/app/utils/constants";
import { fetchPage, fetchSettings } from "@/app/utils/api";
import messages from "../../messages/en.json";

async function checkTagsPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: messages.pages.tags.label })
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

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("tags");
    const setting = await fetchSettings();
    await testPageMetadata(page, {
      title: `${messages.pages.tags.title} | ${AUTHOR_NAME}`,
      description: messages.pages.tags.metaDescription,
      url: buildPageUrl("tags"),
      imageUrl: (data?.imageURL || setting?.imageURL) ?? "",
      imageAlt: setting?.imageAlt,
      // published/modified: omit exact match — depends on Sanity page timestamps
    });
  });
});
