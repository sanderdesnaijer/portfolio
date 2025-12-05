import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { testPageMetadata } from "../utils/metadata";
import { generateTitle } from "@/app/utils/utils";
import { fetchPage, fetchSettings } from "@/app/utils/api";
import { getWebsiteScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import envConfig from "@/envConfig";
import { mockConsent } from "../utils/localStorage";

async function checkHomePageElements(page: Page) {
  await expect(
    page.getByRole("heading", { name: /Sander de Snaijer/i })
  ).toBeVisible();

  const socialButtons = [
    "github",
    "linkedin",
    "gitlab",
    "x",
    "instagram",
    // "youtube",
  ];
  for (const button of socialButtons) {
    await expect(
      page.getByRole("link", { name: `${button} icon` })
    ).toBeVisible();
  }

  await expect(page.getByTestId("site-logo")).toBeVisible();
  await expect(page.getByRole("link", { name: /About/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Projects/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Blog/i })).toBeVisible();
}

test.describe("home", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    await page.goto("/");
  });
  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, "/", checkHomePageElements);
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate between home and subpages", async ({ page }) => {
    await testNavigation(page, "/", "Sander de Snaijer");
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage();
    const setting = await fetchSettings();
    // general meta data
    await testPageMetadata(page, {
      title: generateTitle(),
      description: data!.description,
      url: envConfig.baseUrl,
      imageUrl: setting?.imageURL ?? "",
      imageAlt: setting?.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
    // json-ld
    const expectedJsonLd = getWebsiteScheme(
      data!,
      "https://www.linkedin.com/in/sanderdesnaijer"
    );
    await validateJsonLd(page, expectedJsonLd);
  });
});
