import { expect, test } from "@playwright/test";

test("11. 모바일에서 단축키와 줄 수 및 불필요한 구분자를 숨긴다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await expect(page.locator(".shortcut-command")).toBeHidden();
  await expect(page.locator(".status-lines")).toBeHidden();
  const bookmark = page.locator(".status-actions .status-command").first();
  const group = page.locator(".status-actions .status-command").nth(1);
  await expect(bookmark.locator(".status-separator")).toBeHidden();
  await expect(group.locator(".status-separator")).toBeVisible();
  await expect(page.locator(".status-separator:visible")).toHaveCount(1);
});