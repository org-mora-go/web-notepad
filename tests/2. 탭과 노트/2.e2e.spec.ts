import { expect, test } from "@playwright/test";

test("2. 새 탭을 추가하고 기존 탭을 선택할 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await expect(page.locator(".tab-item .tab-title").nth(1)).toHaveText("-");
  await page.locator("textarea").fill("second note");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await expect(tabs).toHaveCount(3);
  await expect(page.locator(".tab-item .tab-title").nth(2)).toHaveText("-");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("textarea")).toHaveValue("second note");
});
