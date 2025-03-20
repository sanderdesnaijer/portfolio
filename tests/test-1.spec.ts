import { test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Projects" }).click();
  await page.getByRole("link", { name: "Flutter Tabata whip timer" }).click();
});
