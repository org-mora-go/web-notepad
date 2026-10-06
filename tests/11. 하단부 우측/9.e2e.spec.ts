import { expect, test } from "@playwright/test";

test("9. 모바일에서 줄 수와 북마크 앞 구분자를 숨기고 그룹 구분자를 유지한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await expect(page.locator(".status-lines")).toBeHidden();
  const bookmark = page.locator(".status-actions .status-command").first();
  const group = page.locator(".status-actions .status-command").nth(1);
  await expect(bookmark.locator(".status-separator")).toBeHidden();
  await expect(group.locator(".status-separator")).toBeVisible();
  await expect(page.locator(".status-meta .status-separator:visible")).toHaveCount(1);
});