import { test } from "@playwright/test";

test("test", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_BASE_URL!) {
    throw new Error("NEXT_PUBLIC_BASE_URL is missing");
  }
  await page.goto(process.env.NEXT_PUBLIC_BASE_URL);

  await page.getByRole("link", { name: "Projects" }).click();
  await page.getByRole("link", { name: "Flutter Tabata whip timer" }).click();
});
