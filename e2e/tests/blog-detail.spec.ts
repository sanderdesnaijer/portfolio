// import { test, expect, Page } from "@playwright/test";
// import { testResponsive } from "../utils/responsive";
// import { runAccessibilityTest } from "../utils/accessibility";
// import { fetchPageData } from "@/app/api/pageData/utils";
// import { testPageMetadata } from "../utils/metadata";
// import {
//   buildPageUrl,
//   extractTextFromHTML,
//   generateTitle,
//   getImageURL,
// } from "@/app/utils/utils";
// import { getMediumArticle } from "@/app/utils/api";

// async function checkPageElements(page: Page) {
//   await expect(
//     page.getByRole("heading", {
//       name: "Building My First Flutter App: Challenges and Lessons Learned",
//     })
//   ).toBeVisible();

//   await expect(
//     page
//       .getByRole("figure", { name: "Tabata whip timer app store" })
//       .locator("img")
//   ).toBeVisible();

//   expect(
//     page.getByRole("link", { name: "originally published on Medium" })
//   ).toBeVisible();
// }

// test.describe("blog detail", () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto(
//       "blog/building-my-first-flutter-app-challenges-and-lessons-learned"
//     );
//   });

//   test("should display correct elements across breakpoints", async ({
//     page,
//   }) => {
//     await testResponsive(
//       page,
//       "/blog/building-my-first-flutter-app-challenges-and-lessons-learned",
//       checkPageElements
//     );
//   });

//   test("should navigate to the blog overview page and back", async ({
//     page,
//   }) => {
//     await expect(
//       page.getByRole("heading", {
//         name: "Building My First Flutter App: Challenges and Lessons Learned",
//       })
//     ).toBeVisible();

//     const link = page.getByRole("link", { name: "Blog" });
//     await link.click();
//     const href = await link.getAttribute("href");
//     await expect(page).toHaveURL(href!);

//     expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
//     await page.goBack();
//     await expect(
//       page.getByRole("heading", {
//         name: "Building My First Flutter App: Challenges and Lessons Learned",
//       })
//     ).toBeVisible();
//   });

//   test("should meet accessibility standards", async ({ page }) => {
//     await runAccessibilityTest(page);
//   });

//   test("open original medium link", async ({ page }) => {
//     const link = page.getByRole("link", {
//       name: "originally published on Medium",
//     });

//     expect(await link.getAttribute("target")).toBe("_blank");

//     const [newPage] = await Promise.all([
//       page.waitForEvent("popup"), // Wait for a new tab to open
//       link.click(),
//     ]);

//     expect(newPage).toBeTruthy();
//     await newPage.close();
//   });

//   test("should include accurate metadata", async ({ page }) => {
//     const pageData = await fetchPageData("blog");
//     const article = await getMediumArticle({
//       slug: "building-my-first-flutter-app-challenges-and-lessons-learned",
//     });

//     await testPageMetadata(page, {
//       title: generateTitle(pageData!.title, article?.title),
//       description: extractTextFromHTML(article!.description),
//       url: buildPageUrl(
//         "blog",
//         "building-my-first-flutter-app-challenges-and-lessons-learned"
//       ),
//       imageUrl: getImageURL(article!.description)!,
//       publishedTime: article!.pubDate,
//       modifiedTime: article!.pubDate,
//       canonical: article?.link,
//     });
//   });
// });
