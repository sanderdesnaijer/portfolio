import { test, expect, Page } from "@playwright/test";
import { testResponsive } from "../utils/responsive";
import { runAccessibilityTest } from "../utils/accessibility";
import { testPageMetadata } from "../utils/metadata";
import {
  buildPageUrl,
  extractTextFromHTML,
  generateTitle,
  getImageURL,
} from "@/app/utils/utils";
import { mockArticles } from "@/app/test-utils/mockArticle";
import { fetchPage } from "@/app/utils/api";
import { getArticleScheme } from "@/app/utils/jsonLDSchemes";
import { validateJsonLd } from "../utils/jsonLD";

async function checkPageElements(page: Page) {
  await expect(
    page.getByRole("heading", {
      name: /Mock Building My First Flutter App: Challenges and Lessons Learned/i,
    })
  ).toBeVisible();

  await expect(
    page
      .getByRole("figure", { name: /Mock Tabata whip timer app/i })
      .locator("img")
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /originally published on Medium/i })
  ).toBeVisible();
}

test.describe("blog detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "blog/building-my-first-flutter-app-challenges-and-lessons-learned"
    );
  });

  test("should display correct elements across breakpoints", async ({
    page,
  }) => {
    await testResponsive(
      page,
      "/blog/building-my-first-flutter-app-challenges-and-lessons-learned",
      checkPageElements
    );
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

  test("open original medium link", async ({ page }) => {
    const link = page.getByRole("link", {
      name: "originally published on Medium",
    });

    expect(await link.getAttribute("target")).toBe("_blank");

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"), // Wait for a new tab to open
      link.click(),
    ]);

    expect(newPage).toBeTruthy();
    await newPage.close();
  });

  test("should include accurate metadata", async ({ page }) => {
    const pageData = await fetchPage("blog");
    const article = mockArticles[0];

    await testPageMetadata(page, {
      title: generateTitle(pageData!.title, article?.title),
      description: extractTextFromHTML(article!.description),
      url: buildPageUrl(
        "blog",
        "building-my-first-flutter-app-challenges-and-lessons-learned"
      ),
      imageUrl: getImageURL(article!.description)!,
      publishedTime: article!.pubDate,
      modifiedTime: article!.pubDate,
      canonical: article?.link,
    });

    // json-ld
    const expectedJsonLd = getArticleScheme(article!, true);
    await validateJsonLd(page, expectedJsonLd);
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
