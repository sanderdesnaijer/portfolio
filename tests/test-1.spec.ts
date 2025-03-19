import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Projects" }).click();
  await page.getByRole("link", { name: "Flutter Tabata whip timer" }).click();
});
