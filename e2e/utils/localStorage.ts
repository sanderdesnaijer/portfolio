import { Page } from "@playwright/test";

export const mockConsent = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ value: true, expiry: null })
    );
  });
};
