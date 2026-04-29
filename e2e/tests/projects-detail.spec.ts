import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testPageMetadata } from "../utils/metadata";
import {
  buildPageUrl,
  generateContentTitle,
  getDescriptionFromSanity,
} from "@/app/utils/utils";
import { fetchPage, fetchProject, fetchProjects } from "@/app/utils/api";
import { getProjectScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import { mockConsent } from "../utils/localStorage";
import { titleRegExp } from "../utils/regex";

async function checkPageElements(page: Page, projectTitle: string) {
  await expect(
    page.getByRole("heading", { name: titleRegExp(projectTitle) })
  ).toBeVisible();

  await expect(page.getByRole("list", { name: /Resources/i })).toBeVisible();
}

test.describe("projects detail", () => {
  let projectSlug: string;
  let project: Awaited<ReturnType<typeof fetchProject>>;

  test.beforeAll(async () => {
    const projects = await fetchProjects();
    const first = projects?.[0];
    if (!first) return;
    projectSlug = first.slug.current;
    project = await fetchProject(projectSlug);
  });

  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    if (projectSlug) {
      await page.goto(`/projects/${projectSlug}`);
    }
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    test.skip(!project, "No projects available from API");
    await testResponsive(page, `/projects/${projectSlug}`, (p) =>
      checkPageElements(p, project!.title)
    );
  });

  test("should navigate to a project overview page and back", async ({
    page,
  }) => {
    test.skip(!project, "No projects available from API");
    await expect(
      page.getByRole("heading", { name: titleRegExp(project!.title) })
    ).toBeVisible();

    const link = page.getByRole("link", { name: /Projects/i });
    const href = await link.getAttribute("href");
    await link.evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", { name: /Projects/i })
    ).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: titleRegExp(project!.title) })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    test.skip(!project, "No projects available from API");
    await runAccessibilityTest(page);
  });

  test("open resource links in a new tab", async ({ page, browserName }) => {
    test.skip(!project, "No projects available from API");
    const links = await page
      .getByRole("list", { name: /Resources/i })
      .getByRole("link")
      .all();

    test.skip(links.length === 0, "Project has no resource links");

    for (const link of links) {
      const href = await link.getAttribute("href");
      const target = await link.getAttribute("target");
      const isInternal =
        href?.startsWith("/") || href?.startsWith("#") || false;
      expect(target).toBe(isInternal ? "_self" : "_blank");
    }

    const externalLinks = [];
    for (const link of links) {
      const href = await link.getAttribute("href");
      const isInternal =
        href?.startsWith("/") || href?.startsWith("#") || false;
      if (!isInternal) externalLinks.push(link);
    }

    if (browserName !== "webkit" && externalLinks.length > 0) {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        externalLinks[0].click(),
      ]);

      expect(newPage).toBeTruthy();
      await newPage.close();
    }
  });

  test("should include accurate metadata", async ({ page }) => {
    test.setTimeout(60_000);
    test.skip(!project, "No projects available from API");
    const data = await fetchPage("projects");
    const projectDescription = project!.body?.length
      ? getDescriptionFromSanity(project!.body)
      : "";
    const description = projectDescription || data!.description || "";

    await testPageMetadata(page, {
      title: generateContentTitle(project!.title),
      description,
      url: buildPageUrl("projects", projectSlug),
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
