import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { fetchPageData } from "@/app/api/pageData/utils";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /Projects/i })
  ).toBeVisible();

  expect(page.getByRole("list", { name: /Projects/i })).toBeVisible();
  // // Verify at least one project entry exists
  expect(await page.locator("li").count()).toBeGreaterThan(0);
}

test.describe("projects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });
  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, "/projects", checkPageElements);
  });

  test("should navigate to a project detail page and back", async ({
    page,
  }) => {
    const link = page.getByRole("link", {
      name: "Arduino 3d printed dutch word",
    });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", { name: "Arduino 3d printed dutch word" })
    ).toBeVisible();
    expect(
      page.getByRole("img", { name: "Arduino 3d printed wordclock" })
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate back to home and other subpages", async ({ page }) => {
    await testNavigation(page, "/projects", "Projects");
  });

  test("should render dynamic content from Sanity", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Flutter Tabata whip timer" })
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPageData("projects");
    await testPageMetadata(page, {
      title: generateTitle("Projects"),
      description: data!.description,
      url: buildPageUrl("projects"),
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
  });
});
