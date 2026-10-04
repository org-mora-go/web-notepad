import { expect, test } from "@playwright/test";

test("1. Cmd+N과 Alt+N은 활성 패널에 새 탭을 추가한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(1);
  await page.locator("textarea").focus();
  await page.keyboard.press("Meta+n");
  await page.keyboard.press("Alt+n");
  await expect(tabs).toHaveCount(3);
});
