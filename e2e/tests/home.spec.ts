import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { fetchPageData } from "@/app/api/pageData/utils";
import { testPageMetadata } from "../utils/metadata";
import { AUTHOR_NAME } from "@/app/utils/constants";
import { getBaseUrl } from "@/app/utils/routes";

async function checkHomePageElements(page: Page) {
  await expect(
    page.getByRole("heading", { name: /Sander de Snaijer/i })
  ).toBeVisible();
  const socialButtons = ["github", "linkedin", "gitlab"];
  for (const button of socialButtons) {
    await expect(
      page.getByRole("link", { name: `${button} icon` })
    ).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
}

test.describe("home", () => {
  test("page should be responsive", async ({ page }) => {
    await page.goto("/");
    await testResponsive(page, "/", checkHomePageElements);
  });

  test("page should be accessible", async ({ page }) => {
    await page.goto("/");
    await runAccessibilityTest(page);
  });

  test("should navigate to subpages and back", async ({ page }) => {
    const navLinks = [
      { name: "About", url: "/about", heading: "About" },
      { name: "Projects", url: "/projects", heading: "Projects" },
      { name: "Blog", url: "/blog", heading: "Blog" },
    ];

    await testNavigation(page, "/", navLinks);
  });

  test("should load Sanity content", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/Passionate software developer/i)
    ).toBeVisible();
  });

  // test("should show error when...", async ({ page }) => {
  //   // TODO
  // });

  test("page should have correct metadata", async ({ page }) => {
    await page.goto("/");
    const data = await fetchPageData();
    await testPageMetadata(page, {
      title: AUTHOR_NAME,
      description: data!.description,
      url: getBaseUrl(),
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
  });
});
