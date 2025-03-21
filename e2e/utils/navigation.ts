import { Page, expect } from "@playwright/test";

interface NavLink {
  name: string;
  url: string;
  heading: string | RegExp;
}

export async function testNavigation(
  page: Page,
  fromUrl: string,
  navLinks: NavLink[],
  returnHeading: string
): Promise<void> {
  await page.goto(fromUrl);

  for (const link of navLinks) {
    await expect(page.getByRole("link", { name: link.name })).toBeVisible();
  }

  for (const link of navLinks) {
    await page.getByRole("link", { name: link.name }).click();
    await expect(page).toHaveURL(link.url);
    // check for heading if not on home
    if (link.url !== "/") {
      await expect(
        page.getByRole("heading", { name: link.heading })
      ).toBeVisible();
    }

    await page.goBack();
    await expect(
      page.getByRole("heading", { name: returnHeading })
    ).toBeVisible();
  }
}
