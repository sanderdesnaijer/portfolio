import { test, expect } from "@playwright/test";

test.describe("Breadcrumb JSON-LD and title strategy", () => {
  test.describe("Blog detail page", () => {
    test("should have content-first title", async ({ page }) => {
      await page.goto("/blog");

      // Find the first blog link and navigate to it
      const firstLink = page.locator("ol a").first();
      await firstLink.click();
      await page.waitForURL(/\/blog\/.+/);
      // Title should be "Article Title | Sander de Snaijer"
      await expect(page).toHaveTitle(/^.+ \| Sander de Snaijer$/);
      // Title should NOT start with "Sander de Snaijer"
      await expect(page).not.toHaveTitle(/^Sander de Snaijer \|/);
    });

    test("should have BreadcrumbList JSON-LD", async ({ page }) => {
      await page.goto("/blog");

      const firstLink = page.locator("ol a").first();
      await firstLink.click();
      await page.waitForURL(/\/blog\/.+/);

      const jsonLdScripts = await page.locator(
        'script[type="application/ld+json"]'
      );
      const scriptContents = await jsonLdScripts.allTextContents();

      const breadcrumb = scriptContents
        .map((content) => JSON.parse(content))
        .find((json) => json["@type"] === "BreadcrumbList");

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb["@context"]).toBe("https://schema.org");
      expect(breadcrumb.itemListElement).toHaveLength(3);
      expect(breadcrumb.itemListElement[0].name).toBe("Home");
      expect(breadcrumb.itemListElement[0].position).toBe(1);
      expect(breadcrumb.itemListElement[1].name).toBe("Blog");
      expect(breadcrumb.itemListElement[1].position).toBe(2);
      expect(breadcrumb.itemListElement[2].position).toBe(3);
      // Last item should not have an item URL
      expect(breadcrumb.itemListElement[2]).not.toHaveProperty("item");
    });
  });

  test.describe("Blog index page", () => {
    test("should have content-first title", async ({ page }) => {
      await page.goto("/blog");
      await expect(page).toHaveTitle(/^Blog \| Sander de Snaijer$/);
    });

    test("should have 2-level BreadcrumbList JSON-LD", async ({ page }) => {
      await page.goto("/blog");

      const jsonLdScripts = await page.locator(
        'script[type="application/ld+json"]'
      );
      const scriptContents = await jsonLdScripts.allTextContents();

      const breadcrumb = scriptContents
        .map((content) => JSON.parse(content))
        .find((json) => json["@type"] === "BreadcrumbList");

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement).toHaveLength(2);
      expect(breadcrumb.itemListElement[0].name).toBe("Home");
      expect(breadcrumb.itemListElement[1].name).toBe("Blog");
    });
  });

  test.describe("Project detail page", () => {
    test("should have content-first title", async ({ page }) => {
      await page.goto("/projects");

      const firstLink = page.locator("a[href^='/projects/']").first();
      await firstLink.click();
      await page.waitForURL(/\/projects\/.+/);
      await expect(page).toHaveTitle(/^.+ \| Sander de Snaijer$/);
      await expect(page).not.toHaveTitle(/^Sander de Snaijer \|/);
    });

    test("should have BreadcrumbList JSON-LD", async ({ page }) => {
      await page.goto("/projects");

      const firstLink = page.locator("a[href^='/projects/']").first();
      await firstLink.click();
      await page.waitForURL(/\/projects\/.+/);

      const jsonLdScripts = await page.locator(
        'script[type="application/ld+json"]'
      );
      const scriptContents = await jsonLdScripts.allTextContents();

      const breadcrumb = scriptContents
        .map((content) => JSON.parse(content))
        .find((json) => json["@type"] === "BreadcrumbList");

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement).toHaveLength(3);
      expect(breadcrumb.itemListElement[0].name).toBe("Home");
      expect(breadcrumb.itemListElement[1].name).toBe("Projects");
      expect(breadcrumb.itemListElement[2].position).toBe(3);
      expect(breadcrumb.itemListElement[2]).not.toHaveProperty("item");
    });
  });

  test.describe("Projects index page", () => {
    test("should have content-first title", async ({ page }) => {
      await page.goto("/projects");
      await expect(page).toHaveTitle(/^Projects \| Sander de Snaijer$/);
    });

    test("should have 2-level BreadcrumbList JSON-LD", async ({ page }) => {
      await page.goto("/projects");

      const jsonLdScripts = await page.locator(
        'script[type="application/ld+json"]'
      );
      const scriptContents = await jsonLdScripts.allTextContents();

      const breadcrumb = scriptContents
        .map((content) => JSON.parse(content))
        .find((json) => json["@type"] === "BreadcrumbList");

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement).toHaveLength(2);
      expect(breadcrumb.itemListElement[0].name).toBe("Home");
      expect(breadcrumb.itemListElement[1].name).toBe("Projects");
    });
  });

  test.describe("Tags index page", () => {
    test("should have content-first title", async ({ page }) => {
      await page.goto("/tags");
      await expect(page).toHaveTitle(/\| Sander de Snaijer$/);
      await expect(page).not.toHaveTitle(/^Sander de Snaijer \|/);
    });

    test("should have 2-level BreadcrumbList JSON-LD", async ({ page }) => {
      await page.goto("/tags");

      const jsonLdScripts = await page.locator(
        'script[type="application/ld+json"]'
      );
      const scriptContents = await jsonLdScripts.allTextContents();

      const breadcrumb = scriptContents
        .map((content) => JSON.parse(content))
        .find((json) => json["@type"] === "BreadcrumbList");

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement).toHaveLength(2);
      expect(breadcrumb.itemListElement[0].name).toBe("Home");
      expect(breadcrumb.itemListElement[1].name).toBe("Tags");
    });
  });
});
