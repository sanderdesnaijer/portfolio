import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";
import { fetchPage, fetchProjects } from "@/app/utils/api";
import { getProjectsScheme } from "@/app/utils/jsonLDSchemes";

import { validateJsonLd } from "../utils/jsonLD";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /Projects/i })
  ).toBeVisible();

  expect(page.getByRole("list", { name: /Projects/i })).toBeVisible();
  // Verify at least one project entry exists
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
      name: /Arduino 3d printed dutch word/i,
    });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", { name: /Arduino 3d printed dutch word/i })
    ).toBeVisible();
    expect(
      page.getByRole("img", { name: /Arduino 3d printed wordclock/i })
    ).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: /Projects/i })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate back to home and other subpages", async ({ page }) => {
    await testNavigation(page, "/projects", "Projects");
  });

  test("should render dynamic content from Sanity", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Flutter Tabata whip timer/i })
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("projects");
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

  test("JSON-LD Validation", async ({ page }) => {
    const data = await fetchPage("projects");
    const projects = await fetchProjects();

    // json-ld
    const expectedJsonLd = getProjectsScheme({
      page: data!,
      projects: projects!,
    });
    const validatedJsonLD = await validateJsonLd(page, expectedJsonLd);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testProject = (type: string, element: Record<string, any>) => {
      expect(element.image).toBeTruthy();
      expect(element.image.length).toBeGreaterThan(0);

      expect(element.name).toBeTruthy();
      expect(element.name.length).toBeGreaterThan(0);

      expect(element.url).toBeTruthy();
      expect(element.url.length).toBeGreaterThan(0);

      expect(element["@id"]).toBeTruthy();
      expect(element["@id"].length).toBeGreaterThan(0);

      // check type
      if (
        type === "SoftwareApplication" ||
        type === "MobileApplication" ||
        type === "WebApplication"
      ) {
        expect(element.applicationCategory).toBeTruthy();
        expect(element.applicationCategory.length).toBeGreaterThan(0);
      }
      if (type === "SoftwareApplication") {
        expect(element.operatingSystem).toBeTruthy();
        expect(element.operatingSystem.length).toBeGreaterThan(0);
      }

      if (type === "SoftwareSourceCode") {
        expect(element.codeRepository).toBeTruthy();
        expect(element.codeRepository.length).toBeGreaterThan(0);

        expect(element.programmingLanguage).toBeTruthy();
        expect(element.programmingLanguage.length).toBeGreaterThan(0);
      }
      // check category
      if (element.applicationCategory === "MobileApplication") {
        expect(element.downloadUrl).toBeTruthy();
        expect(element.downloadUrl.length).toBeGreaterThan(0);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validatedJsonLD.hasPart.forEach((element: any) => {
      const types = Array.isArray(element["@type"])
        ? element["@type"]
        : [element["@type"]];
      types.forEach((type) => testProject(type, element));
    });
  });
});
