import { mockConsent } from "@/e2e/utils/localStorage";
import { test, expect } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
  });

  test("Mobile sticky navigation behavior on scroll and click", async ({
    page,
  }) => {
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 812 });

    // Use blog page for more scrollable content
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { level: 1, name: /Blog/i })
    ).toBeVisible();

    const nav = page.locator("nav");
    const header = page.locator("header");
    const navLink = nav.getByRole("link", { name: "Projects", exact: true });

    // Ensure navigation is initially visible
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Scroll incrementally so the scroll handler detects "down" direction
    // before potentially reaching the page bottom
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Check that navigation is hidden (header has hide-menu class)
    await expect(header).toHaveClass(/hide-menu/);

    // Scroll up 100px instead of 10px (more realistic)
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(300);

    // Ensure navigation is visible again
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Click the navigation link
    await navLink.click();

    // Ensure URL changed correctly
    await expect(page).toHaveURL("/projects");
    await expect(
      page.getByRole("heading", { level: 1, name: /Projects/i })
    ).toBeVisible();

    // Ensure nav is visible after navigation
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Go back and verify the URL and nav visibility
    await page.goBack();
    await expect(page).toHaveURL("/blog");
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();
  });

  test("Mobile sticky navigation behavior and persistence after viewport change", async ({
    page,
  }) => {
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 812 });

    // Use blog page for more scrollable content
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { level: 1, name: /Blog/i })
    ).toBeVisible();

    const nav = page.locator("nav");
    const header = page.locator("header");
    const navLink = nav.getByRole("link", { name: "Projects", exact: true });

    // Ensure navigation is initially visible
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Scroll incrementally so the scroll handler detects "down" direction
    // before potentially reaching the page bottom
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Check that navigation is hidden (header has hide-menu class)
    await expect(header).toHaveClass(/hide-menu/);

    // Scroll up 100px
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(500);

    // Ensure navigation is visible again
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // **Switch to desktop viewport**
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500); // Allow UI adjustments

    // Ensure navigation is still visible after switching to desktop
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Click the navigation link
    await navLink.click();

    // Ensure URL changed correctly
    await expect(page).toHaveURL("/projects");
    await expect(
      page.getByRole("heading", { level: 1, name: /Projects/i })
    ).toBeVisible();

    // Ensure nav is visible after navigation
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Go back and verify the URL and nav visibility
    await page.goBack();
    await expect(page).toHaveURL("/blog");
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();
  });
});
