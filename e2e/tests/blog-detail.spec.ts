import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";
import { fetchPage, fetchArticle, fetchArticles } from "@/app/utils/api";
import { getArticleScheme } from "@/app/utils/jsonLDSchemes";
import { getExcerpt } from "@/app/utils/blogUtils";
import { validateJsonLd } from "../utils/jsonLD";
import { mockConsent } from "../utils/localStorage";
import { titleRegExp } from "../utils/regex";

async function checkPageElements(page: Page, articleTitle: string) {
  await expect(
    page.getByRole("heading", {
      name: titleRegExp(articleTitle),
    })
  ).toBeVisible();
}

test.describe("blog detail", () => {
  let articleSlug: string;
  let firstArticle: Awaited<ReturnType<typeof fetchArticle>>;

  test.beforeAll(async () => {
    const articles = await fetchArticles();
    const first = articles?.[0];
    if (!first) return;
    articleSlug = first.slug.current;
    firstArticle = await fetchArticle(articleSlug);
  });

  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    if (articleSlug) {
      await page.goto(`/blog/${articleSlug}`);
    }
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    test.skip(!firstArticle, "No articles available from API");
    await testResponsive(page, `/blog/${articleSlug}`, (p) =>
      checkPageElements(p, firstArticle!.title)
    );
  });

  test("should navigate to the blog overview page and back", async ({
    page,
  }) => {
    test.skip(!firstArticle, "No articles available from API");
    await expect(
      page.getByRole("heading", {
        name: titleRegExp(firstArticle!.title),
      })
    ).toBeVisible();

    const link = page.getByRole("link", { name: "Blog" });
    const href = await link.getAttribute("href");
    await link.evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL(href!);

    expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", {
        name: titleRegExp(firstArticle!.title),
      })
    ).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    test.skip(!firstArticle, "No articles available from API");
    await runAccessibilityTest(page);
  });

  test("should include accurate metadata", async ({ page }) => {
    test.skip(!firstArticle, "No articles available from API");
    const pageData = await fetchPage("blog");
    const article = firstArticle!;

    await testPageMetadata(page, {
      title: generateTitle(pageData!.title, article?.title),
      description: getExcerpt(article!),
      url: buildPageUrl("blog", articleSlug),
      imageUrl: article!.imageURL!,
      publishedTime: article!.publishedAt,
      modifiedTime: article!._updatedAt || article!.publishedAt,
    });

    const expectedJsonLd = getArticleScheme(article!, "blog", true);
    await validateJsonLd(page, expectedJsonLd);
  });

  test("should have a valid og:image URL with sizing parameters", async ({
    page,
  }) => {
    test.skip(!firstArticle, "No articles available from API");
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
