import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { fetchPageData } from "@/app/api/pageData/utils";
import { testPageMetadata } from "../utils/metadata";
import { getBaseUrl } from "@/app/utils/routes";
import { generateTitle } from "@/app/utils/utils";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /Blog/i })
  ).toBeVisible();

  expect(page.getByRole("list", { name: /Blog articles/i })).toBeVisible();
  // // Verify at least one project entry exists
  expect(await page.locator("li").count()).toBeGreaterThan(0);
}

test.describe("blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, "/blog", checkPageElements);
  });

  test("should navigate to a blog detail page and back", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "networkidle" });
    const link = page.getByRole("link", {
      name: "Building My First Flutter App",
    });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", {
        name: "Building My First Flutter App: Challenges and Lessons Learned",
      })
    ).toBeVisible();

    await page.goBack();
    await expect(page.getByRole("heading", { name: /Blog/i })).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate back to home and other subpages", async ({ page }) => {
    await testNavigation(page, "/blog", "Blog");
  });

  test("should render dynamic content from Sanity", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /Blog/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Building My First Flutter App" })
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPageData("blog");
    await testPageMetadata(page, {
      title: generateTitle("Blog"),
      description: data!.description,
      url: `${getBaseUrl()}/blog`,
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
  });
});
