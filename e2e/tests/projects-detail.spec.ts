import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { fetchPageData } from "@/app/api/pageData/utils";
import { testPageMetadata } from "../utils/metadata";
import { getBaseUrl } from "@/app/utils/routes";
import {
  buildPageUrl,
  generateTitle,
  getDescriptionFromSanity,
} from "@/app/utils/utils";
import { fetchProjectData } from "@/app/api/project/utils";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Flutter Tabata whip timer" })
  ).toBeVisible();

  expect(
    page.getByRole("img", { name: "Flutter tabata whip timer app" })
  ).toBeVisible();

  expect(page.getByRole("link", { name: "link to article" })).toBeVisible();
  expect(page.getByRole("list", { name: "Related tags" })).toBeVisible();
  expect(page.getByRole("list", { name: "Project resources" })).toBeVisible();
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
      page.getByRole("heading", { name: "Flutter Tabata whip timer" })
    ).toBeVisible();

    const link = page.getByRole("link", { name: "Projects" });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: "Flutter Tabata whip timer" })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("open resource links in a new tab", async ({ page }) => {
    const links = await page
      .getByRole("list", { name: "Project resources" })
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
    const data = await fetchPageData("projects");
    const project = await fetchProjectData("flutter-tabata-whip-timer");

    await testPageMetadata(page, {
      title: generateTitle(data!.title, project!.title),
      description: getDescriptionFromSanity(project!.body),
      url: buildPageUrl("projects", "flutter-tabata-whip-timer"),
      imageUrl: project!.imageURL!,
      imageAlt: project!.imageAlt,
      publishedTime: project!._createdAt,
      modifiedTime: project!._updatedAt,
    });
  });
});
