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

    // Navigate to the page
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /About/i })
    ).toBeVisible();

    const nav = page.locator("nav");
    const navLink = page.getByRole("link", { name: "Projects" });

    // Ensure navigation is initially visible
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Scroll down 500px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000); // Ensure scroll event processes

    // Check that navigation is NOT in viewport (hidden)
    await expect(nav).not.toBeInViewport();

    // Scroll up 100px instead of 10px (more realistic)
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(300); // Ensure UI updates

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
    await expect(page).toHaveURL("/about");
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();
  });

  test("Mobile sticky navigation behavior and persistence after viewport change", async ({
    page,
  }) => {
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 812 });

    // Navigate to the page
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /About/i })
    ).toBeVisible();

    const nav = page.locator("nav");
    const navLink = page.getByRole("link", { name: "Projects" });

    // Ensure navigation is initially visible
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();

    // Scroll down 500px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForFunction(() => window.scrollY >= 450); // Wait for scroll position

    await expect(nav).not.toBeInViewport();

    // Scroll up 100px instead of 10px (more realistic)
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(500); // Ensure UI updates

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
    await expect(page).toHaveURL("/about");
    await expect(nav).toBeVisible();
    await expect(nav).toBeInViewport();
  });
});
