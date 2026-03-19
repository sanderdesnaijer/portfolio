import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testNavigation } from "../utils/navigation";
import { testPageMetadata } from "../utils/metadata";
import { buildPageUrl, generateTitle } from "@/app/utils/utils";
import { fetchPage, fetchSettings, fetchArticles } from "@/app/utils/api";
import { getBlogsScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";
import { mockConsent } from "../utils/localStorage";
import messages from "../../messages/en.json";
import { titleRegExp } from "../utils/regex";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: /Blog/i })
  ).toBeVisible();

  await expect(
    page.getByRole("list", { name: /Blog articles/i })
  ).toBeVisible();

  expect(await page.locator("li").count()).toBeGreaterThan(0);
}

test.describe("blog", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
    await page.goto("/blog");
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(page, "/blog", checkPageElements);
  });

  test("should navigate to a blog detail page and back", async ({ page }) => {
    const articles = await fetchArticles();
    const firstArticle = articles?.[0];
    test.skip(!firstArticle, "No articles available from API");

    const link = page.getByRole("link", {
      name: titleRegExp(firstArticle!.title),
    });
    const href = await link.getAttribute("href");
    await link.click();
    await expect(page).toHaveURL(href!);

    await expect(
      page.getByRole("heading", {
        name: titleRegExp(firstArticle!.title),
      })
    ).toBeVisible();

    await page.goBack();
    await expect(page.getByRole("heading", { name: /Blog/i })).toBeVisible();
  });

  test("should meet accessibility standards", async ({ page }) => {
    await runAccessibilityTest(page);
  });

  test("should navigate back to home and other subpages", async ({ page }) => {
    await testNavigation(page, "/blog", "Blog");
  });

  test("should render dynamic content from Sanity", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /Blog/i })
    ).toBeVisible();
    const articles = await fetchArticles();
    const firstArticle = articles?.[0];
    test.skip(!firstArticle, "No articles available from API");
    await expect(
      page.getByRole("link", { name: titleRegExp(firstArticle!.title) })
    ).toBeVisible();
  });

  test("should include accurate metadata", async ({ page }) => {
    const data = await fetchPage("blog");
    const setting = await fetchSettings();

    await testPageMetadata(page, {
      title: generateTitle("Blog"),
      description: messages.pages.blog.metaDescription,
      url: buildPageUrl("blog"),
      imageUrl: (data?.imageURL || setting?.imageURL) ?? "",
      imageAlt: setting?.imageAlt,
      publishedTime: data!._createdAt,
      modifiedTime: data!._updatedAt,
    });
  });

  test("JSON-LD Validation", async ({ page }) => {
    const data = await fetchPage("blog");
    const articles = await fetchArticles();

    const expectedJsonLd = getBlogsScheme({
      page: data!,
      articles: articles ?? [],
    });
    const validatedJsonLd = await validateJsonLd(page, expectedJsonLd, {
      strictMatch: false,
    });

    expect(validatedJsonLd.name).toBeTruthy();
    expect(validatedJsonLd.name.length).toBeGreaterThan(0);

    expect(validatedJsonLd.url).toBeTruthy();
    expect(validatedJsonLd.url.length).toBeGreaterThan(0);

    expect(validatedJsonLd["@context"]).toBeTruthy();
    expect(validatedJsonLd["@context"].length).toBeGreaterThan(0);

    expect(validatedJsonLd["@type"]).toBeTruthy();
    expect(validatedJsonLd["@type"].length).toBeGreaterThan(0);

    const blogPosts = validatedJsonLd.blogPost ?? validatedJsonLd.hasPart ?? [];
    blogPosts.forEach((post: unknown) => {
      expect(post).toEqual(
        expect.objectContaining({
          "@type": "BlogPosting",
          "@id": expect.any(String),
          headline: expect.any(String),
          url: expect.any(String),
          datePublished: expect.any(String),
          author: expect.any(Object),
          publisher: expect.any(Object),
        })
      );
    });
  });
});
