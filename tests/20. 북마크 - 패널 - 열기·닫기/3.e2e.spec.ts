import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("3. Escape로 북마크 패널을 닫고 북마크를 유지한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "Preserve this bookmark");
  const panel = page.locator("#bookmarks-panel");
  const toggle = page.locator('button[aria-controls="bookmarks-panel"]');

  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await toggle.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await panel.getByPlaceholder("Search bookmarks").fill("Preserve");
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("textarea")).toHaveValue("Preserve this bookmark");
    await toggle.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(panel.getByRole("strong")).toHaveText("Preserve this bookmark");
    await page.goBack();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
});