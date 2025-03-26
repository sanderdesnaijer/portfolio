import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testPageMetadata } from "../utils/metadata";
import {
  buildPageUrl,
  generateTitle,
  getDescriptionFromSanity,
} from "@/app/utils/utils";
import { fetchPage, fetchProject } from "@/app/utils/api";
import { getProjectScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { name: /Flutter Tabata whip timer/i })
  ).toBeVisible();

  await expect(
    page.getByRole("img", { name: /Flutter tabata whip timer app/i })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /link to article/i })
  ).toBeVisible();
  await expect(page.getByRole("list", { name: /Related tags/i })).toBeVisible();
  await expect(
    page.getByRole("list", { name: /Project resources/i })
  ).toBeVisible();
}

test.describe("projects detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/flutter-tabata-whip-timer");
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(
      page,
      "/projects/flutter-tabata-whip-timer",
      checkPageElements
    );
  });

  test("should navigate to a project overview page and back", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /Flutter Tabata whip timer/i })
    ).toBeVisible();

    const link = page.getByRole("link", { name: /Projects/i });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", { name: /Projects/i })
    ).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: /Flutter Tabata whip timer/i })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("open resource links in a new tab", async ({ page }) => {
    const links = await page
      .getByRole("list", { name: /Project resources/i })
      .getByRole("link")
      .all();

    for (const link of links) {
      const target = await link.getAttribute("target");
      expect(target).toBe("_blank");
    }

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"), // Wait for a new tab to open
      links[0].click(),
    ]);

    expect(newPage).toBeTruthy();
    await newPage.close();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("projects");
    const project = await fetchProject("flutter-tabata-whip-timer");

    await testPageMetadata(page, {
      title: generateTitle(data!.title, project!.title),
      description: getDescriptionFromSanity(project!.body),
      url: buildPageUrl("projects", "flutter-tabata-whip-timer"),
      imageUrl: project!.imageURL!,
      imageAlt: project!.imageAlt,
      publishedTime: project!._createdAt,
      modifiedTime: project!._updatedAt,
    });

    // json-ld
    const expectedJsonLd = getProjectScheme(project!, data!.slug.current, true);
    await validateJsonLd(page, expectedJsonLd);
  });

  test("show a message when project can not be found", async ({ page }) => {
    await page.goto("/projects/does-not-exist");

    await expect(
      page.getByRole("heading", { name: /Project not found/i })
    ).toBeVisible();

    expect(
      page.getByText(/Sorry, we couldn't find the project you're looking for/i)
    ).toBeVisible();

    const pageLink = page.getByRole("link", { name: "Go back to the project" });
    const href = await pageLink.getAttribute("href");
    await pageLink.click();
    await expect(page).toHaveURL(href!);
  });
});
