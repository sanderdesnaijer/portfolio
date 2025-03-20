import { Page } from "@playwright/test";

// Reusable responsive test utility
export async function testResponsive(
  page: Page,
  url: string,
  checkElementsFn: (page: Page) => Promise<void>
) {
  // Define Tailwind breakpoints
  const breakpoints = {
    sm: { width: 640, height: 800 },
    md: { width: 768, height: 800 },
    lg: { width: 1024, height: 800 },
    xl: { width: 1280, height: 800 },
    "2xl": { width: 1536, height: 800 },
  };

  // Load the page
  await page.goto(url);

  // Test each breakpoint in sequence
  for (const [, size] of Object.entries(breakpoints)) {
    await page.setViewportSize(size);
    await checkElementsFn(page);
  }
}
