import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright"; // 1

test.describe("navigation", () => {
  const pages = ["/", "/about", "/projects", "/blog"];

  for (const path of pages) {
    test(`should display nav bar on ${path}`, async ({ page }) => {
      await page.goto(path);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
