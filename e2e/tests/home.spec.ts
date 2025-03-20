import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("render home and be able to navigate to subpages", async ({ page }) => {
    await page.goto("/");

    // heading
    await expect(
      page.getByRole("heading", { name: /Sander de Snaijer/i })
    ).toBeVisible();

    // socials
    const socialButtons = ["github", "linkedin", "gitlab"];
    socialButtons.forEach((button) => {
      expect(page.getByRole("link", { name: `${button} icon` })).toBeVisible();
    });

    // page navigation
    await expect(page.locator("text=Home")).toBeVisible();
    await expect(page.locator("text=About")).toBeVisible();
    await expect(page.locator("text=Projects")).toBeVisible();
    await expect(page.locator("text=Blog")).toBeVisible();

    await page.getByRole("link", { name: "About" }).click();
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
    await expect(page).toHaveURL("/about");
    await page.goBack();

    await expect(
      page.getByRole("heading", { name: /Sander de Snaijer/i })
    ).toBeVisible();
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page).toHaveURL("/projects");
    await page.goBack();

    await expect(
      page.getByRole("heading", { name: /Sander de Snaijer/i })
    ).toBeVisible();
    await page.getByRole("link", { name: "Blog" }).click();
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    await expect(page).toHaveURL("/blog");
    await page.goBack();

    await expect(
      page.getByRole("heading", { name: /Sander de Snaijer/i })
    ).toBeVisible();
  });
});
