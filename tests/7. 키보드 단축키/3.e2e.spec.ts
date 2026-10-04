import { expect, test } from "@playwright/test";

test("3. Alt+W와 Alt+Backspace는 활성 탭을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await page.locator("textarea").focus();
  await page.keyboard.press("Meta+n");
  const tabs = page.locator('[role="tab"]');
  await page.keyboard.press("Alt+w");
  await expect(tabs).toHaveCount(1);
  await page.keyboard.press("Meta+n");
  await page.keyboard.press("Alt+Backspace");
  await expect(tabs).toHaveCount(1);
});
