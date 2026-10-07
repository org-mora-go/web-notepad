import { expect, test } from "@playwright/test";

test("4. PC와 모바일에서 북마크 앞 구분자 없이 그룹 구분자만 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const bookmark = page.locator(".status-actions .status-command").first();
  const group = page.locator(".status-actions .status-command").nth(1);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(bookmark.locator(".status-separator")).toHaveCount(0);
    await expect(group.locator(".status-separator")).toBeVisible();
    await expect(group.locator(".status-separator")).toHaveText("|");
    await expect(page.locator(".status-meta .status-separator:visible")).toHaveCount(1);
  }
});
