import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  const pages = ["/", "/about", "/projects", "/blog"];

  for (const path of pages) {
    test(`should display nav bar on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("nav")).toBeVisible();
      await page.click("text=Home");
      await expect(page).toHaveURL("/");
    });
  }
});
