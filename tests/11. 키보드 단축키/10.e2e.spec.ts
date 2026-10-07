import { expect, test } from "@playwright/test";

test("10. 모바일에서 SHORTCUT 버튼과 구분자를 숨긴다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcut = page.locator(".shortcut-command");
  await expect(shortcut).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(shortcut).toBeHidden();
  await expect(shortcut.locator(".status-separator")).toBeHidden();
});