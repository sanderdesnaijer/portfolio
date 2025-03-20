import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function runAccessibilityTest(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}
