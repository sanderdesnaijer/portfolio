import { expect, Page, test } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl } from "@/app/utils/utils";
import { fetchJobs, fetchPage, fetchSettings } from "@/app/utils/api";
import { getAboutScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { JobSanity } from "@/sanity/types";
import { mockConsent } from "../utils/localStorage";
async function checkAboutPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /About/i })
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Sander de Snaijer/i }).first()
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
    await mockConsent(page);
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
    await expect(
      page.getByText(/frontend developer|software developer/i).first()
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("about");
    const url = buildPageUrl("about");
    await testPageMetadata(page, {
      url,
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      disableBrandSuffix: true,
      // published/modified: omit exact match — /api/page cache can skew vs HTML under `next start`
    });

    const setting = await fetchSettings();
    const socialLinks = setting!.socialMedia.map((s) => s.link);
    const jobs = await fetchJobs();
    const activeJobs = jobs!.reduce(
      (list: string[], job: JobSanity) =>
        job.endDate === null ? list.concat(job.companyName) : list,
      []
    );

    // json-ld
    const expectedJsonLd = getAboutScheme({
      page: data!,
      jobs: activeJobs,
      jobTitle: getTranslationKey("pages.about.jobTitle"),
      links: socialLinks,
    });
    await validateJsonLd(page, expectedJsonLd);
  });
});
