import { expect, test } from "@playwright/test";

test("3. Alt+Backspace는 활성 탭을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await page.keyboard.press("Alt+Backspace");
  await expect(tabs).toHaveCount(1);
});
