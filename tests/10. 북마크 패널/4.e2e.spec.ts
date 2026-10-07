import { expect, test } from "@playwright/test";

test("4. 브라우저 뒤로가기로 열린 북마크 패널을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.locator('button[aria-controls="bookmarks-panel"]').click();
    await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
    await page.goBack();
    await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
  }
});
