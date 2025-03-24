import { expect, Page, test } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";
import { fetchJobs, fetchPage, fetchSettings } from "@/app/utils/api";
import { getAboutScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import { getTranslationKey } from "@/app/test-utils/i18n";
import { JobSanity } from "@/sanity/types";
async function checkAboutPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /About/i })
  ).toBeVisible();

  expect(
    page.getByRole("img", { name: /Profile picture Sander de Snaijer/i })
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
    await expect(
      page.getByText(/Passionate software developer/i)
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("about");
    const url = buildPageUrl("about");
    await testPageMetadata(page, {
      title: generateTitle("About"),
      description: data!.description,
      url,
      imageUrl: data!.imageURL,
      imageAlt: data!.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
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
      imageUrl: data!.imageURL,
      url,
      jobs: activeJobs,
      jobTitle: getTranslationKey("pages.about.jobTitle"),
      links: socialLinks,
    });
    await validateJsonLd(page, expectedJsonLd);
  });
});
