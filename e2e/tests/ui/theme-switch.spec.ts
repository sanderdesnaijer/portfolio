import { mockConsent } from "@/e2e/utils/localStorage";
import { test, expect } from "@playwright/test";

test.describe("theme-switch dark/light", () => {
  test.beforeEach(async ({ page }) => {
    await mockConsent(page);
  });
  test("toggles dark/light mode correctly", async ({ page }) => {
    await page.goto("/");

    const body = page.locator("html");
    await expect(body).toHaveClass(/light/);

    await page.getByRole("button", { name: "system" }).click();

    await expect(body).toHaveClass(/dark/);
    const themeFromLocalStorage = await page.evaluate(() => {
      return localStorage.getItem("theme");
    });
    expect(themeFromLocalStorage).toBe("dark");
    // go back to light mode
    await page.getByRole("button", { name: /dark/i }).click();
    await expect(body).toHaveClass(/light/);
    const themeFromLocalStorage2 = await page.evaluate(() => {
      return localStorage.getItem("theme");
    });
    expect(themeFromLocalStorage2).toBe("light");
    // go back to dark mode
    await page.getByRole("button", { name: /light/i }).click();
    await expect(body).toHaveClass(/dark/);
  });

  test("should respect system preference for dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should respect system preference for light mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("should respect dark mode setting from local storage", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should respect light mode setting from local storage", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("should persist theme after page reload", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "system" });
    await toggle.click(); // Switch to dark mode

    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload(); // Reload the page
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
