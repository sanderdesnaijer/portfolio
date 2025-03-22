import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { fetchPageData } from "@/app/api/pageData/utils";
import { testPageMetadata } from "../utils/metadata";
import { getBaseUrl } from "@/app/utils/routes";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";

async function checkAboutPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /About/i })
  ).toBeVisible();

  expect(
    page.getByRole("img", { name: "Profile picture Sander de Snaijer" })
  ).toBeVisible();

  // // Check if the job experience section is present
  expect(page.getByRole("heading", { name: /Experience/i })).toBeVisible();
  expect(
    page.getByRole("list", { name: /Professional Experience/i })
  ).toBeVisible();

  // // Verify at least one job entry exists
  expect(await page.locator("li").count()).toBeGreaterThan(0);
}

test.describe("about", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, "/about", checkAboutPageElements);
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate back to home and other subpages", async ({ page }) => {
    await testNavigation(page, "/about", "about");
  });

  test("should render dynamic content from Sanity", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "[Link to] Royal Netherlands" })
    ).toBeVisible();
    await expect(page.getByText("Passionate software developer")).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPageData("about");
    await testPageMetadata(page, {
      title: generateTitle("About"),
      description: data!.description,
      url: buildPageUrl("about"),
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
  });
});
