import { Page, expect } from "@playwright/test";

interface NavLink {
  name: string;
  url: string;
  heading: string | RegExp;
}

// Helper function to test navigation
export async function testNavigation(
  page: Page,
  fromUrl: string,
  navLinks: NavLink[]
): Promise<void> {
  // Load the starting page
  await page.goto(fromUrl);

  // Check visibility of all navigation links
  for (const link of navLinks) {
    await expect(page.getByRole("link", { name: link.name })).toBeVisible();
  }

  // Test navigation to each page and back
  for (const link of navLinks) {
    // Click the link
    await page.getByRole("link", { name: link.name }).click();

    // Verify URL and heading
    await expect(page).toHaveURL(link.url);
    await expect(
      page.getByRole("heading", { name: link.heading })
    ).toBeVisible();

    // Go back and verify we're back on the homepage
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: /Sander de Snaijer/i })
    ).toBeVisible();
  }
}
