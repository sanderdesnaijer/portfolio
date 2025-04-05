import { test, expect } from "@playwright/test";

test.describe("cookie Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("is visible on first visit (no localStorage consent)", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /Allow cookies/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Decline/i })).toBeVisible();
  });

  test("hides after accepting cookies and persists on reload", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Allow cookies/i }).click();
    await expect(
      page.getByRole("button", { name: /Allow cookies/i })
    ).toBeHidden();

    // Reload and make sure banner does not show again
    await page.reload();
    await expect(
      page.getByRole("button", { name: /Allow cookies/i })
    ).toBeHidden();
  });

  test("hides after declining cookies and persists on reload", async ({
    page,
  }) => {
    await page.reload(); // ensure clean state
    await page.evaluate(() => localStorage.removeItem("cookie_consent"));

    await page.getByRole("button", { name: /Decline/i }).click();
    await expect(page.getByRole("button", { name: /Decline/i })).toBeHidden();

    await page.reload();
    await expect(page.getByRole("button", { name: /Decline/i })).toBeHidden();
  });

  test("does not show if consent is already set to true in localStorage", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie_consent", "true");
    });
    await page.reload();
    await expect(
      page.getByRole("button", { name: /Allow cookies/i })
    ).toBeHidden();
  });

  test("does not show if consent is already set to false in localStorage", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie_consent", "false");
    });
    await page.reload();
    await expect(page.getByRole("button", { name: /Decline/i })).toBeHidden();
  });
});
