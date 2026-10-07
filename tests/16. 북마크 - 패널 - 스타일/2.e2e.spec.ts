import { expect, test } from "@playwright/test";

test("2. 북마크 패널 헤더의 위아래 패딩을 9px로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();

  const header = page.locator("#bookmarks-panel .bookmark-header");
  await expect(header).toHaveCSS("min-height", "55px");
  await expect(header).toHaveCSS("height", "55px");
  await expect(header).toHaveCSS("padding-top", "9px");
  await expect(header).toHaveCSS("padding-bottom", "9px");
});
