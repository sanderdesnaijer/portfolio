import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";
import { mockArticles } from "@/app/test-utils/mockArticle";
import { fetchPage } from "@/app/utils/api";
import { getArticleScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import { mockConsent } from "../utils/localStorage";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", {
      name: /Mock Building My First Flutter App: Challenges and Lessons Learned/i,
    })
  ).toBeVisible();
}

const mockSlug =
  "mock-building-my-first-flutter-app-challenges-and-lessons-learned";

test.describe("blog detail", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    await page.goto(`blog/${mockSlug}`);
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, `/blog/${mockSlug}`, checkPageElements);
  });

  test("should navigate to the blog overview page and back", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", {
        name: /Mock Building My First Flutter App: Challenges and Lessons Learned/i,
      })
    ).toBeVisible();

    const link = page.getByRole("link", { name: "Blog" });
    await link.click();
    const href = await link.getAttribute("href");
    await expect(page).toHaveURL(href!);

    expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", {
        name: /Mock Building My First Flutter App: Challenges and Lessons Learned/i,
      })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should include accurate metadata", async ({ page }) => {
    const pageData = await fetchPage("blog");
    const article = mockArticles[0];

    await testPageMetadata(page, {
      title: generateTitle(pageData!.title, article?.title),
      description: article!.excerpt!,
      url: buildPageUrl("blog", mockSlug),
      imageUrl: article!.imageURL!,
      publishedTime: article!.publishedAt,
      modifiedTime: article!.publishedAt,
    });

    const expectedJsonLd = getArticleScheme(article!, "blog", true);
    await validateJsonLd(page, expectedJsonLd);
  });

  test("should have a valid og:image URL with sizing parameters", async ({
    page,
  }) => {
    const ogImage = await page
      .locator('head meta[property="og:image"]')
      .getAttribute("content");

    expect(ogImage).toBeTruthy();
    expect(ogImage).toMatch(/^https?:\/\//);
    expect(ogImage).toContain("w=1200");
    expect(ogImage).toContain("h=630");
    expect(ogImage).toContain("fit=crop");
    expect(ogImage).toContain("auto=format");

    const twitterImage = await page
      .locator('head meta[name="twitter:image"]')
      .getAttribute("content");

    expect(twitterImage).toBeTruthy();
    expect(twitterImage).toMatch(/^https?:\/\//);
    expect(twitterImage).toContain("w=1200");
    expect(twitterImage).toContain("h=630");
  });
});

test.describe("blog detail not found", () => {
  test("blog detail show a message when blog can not be found", async ({
    page,
  }) => {
    await page.goto("/blog/does-not-exist");

    await expect(
      page.getByRole("heading", { name: /Blog not found/i })
    ).toBeVisible();

    expect(
      page.getByText(/Sorry, we couldn't find the blog you're looking for/i)
    ).toBeVisible();

    const pageLink = page.getByRole("link", {
      name: /Go back to the blog overview/i,
    });
    const href = await pageLink.getAttribute("href");
    await pageLink.click();
    await expect(page).toHaveURL(href!);
  });
});
