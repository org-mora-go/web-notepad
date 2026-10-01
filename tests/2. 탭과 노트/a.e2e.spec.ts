import { expect, test } from "@playwright/test";

test("a. 마지막 탭을 닫으면 빈 탭이 새로 만들어진다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator(".tab-item").first().locator(".tab-close").click();
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await expect(page.locator("textarea")).toHaveValue("");
});
