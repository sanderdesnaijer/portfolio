import { Page, expect } from "@playwright/test";

const mainNavLinks = [
  { name: "Home", url: "/", heading: "" },
  { name: "About", url: "/about", heading: "About" },
  { name: "Projects", url: "/projects", heading: "Projects" },
  { name: "Blog", url: "/blog", heading: "Blog" },
];

export async function testNavigation(
  page: Page,
  fromUrl: string,
  returnHeading: string
): Promise<void> {
  await page.goto(fromUrl);

  const navLinks = mainNavLinks.filter((link) => link.url !== fromUrl);

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
    await expect(page).toHaveURL(fromUrl);

    await expect(
      page.getByRole("heading", { name: returnHeading })
    ).toBeVisible();
  }
}
