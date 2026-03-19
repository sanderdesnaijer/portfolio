import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function runAccessibilityTest(page: Page) {
  const hasMain = await page.locator("main").count();
  if (hasMain === 0) return;

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .include("main")
    .exclude(["iframe", "youtube-video"])
    .disableRules(["heading-order", "frame-title"])
    .analyze();

  expect(results.violations).toEqual([]);
}
