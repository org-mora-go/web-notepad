import { expect, test } from "@playwright/test";

test("2-2. 새 탭을 추가하고 선택하고 닫을 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.locator(".tab-item").nth(1).locator(".tab-close").click();
  await expect(tabs).toHaveCount(1);
});
