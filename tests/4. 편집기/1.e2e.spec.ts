import { expect, test } from "@playwright/test";

test("1. 여러 줄 텍스트와 줄 번호 및 전체 줄 수를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines).toHaveCount(3);
  await expect(lines).toHaveText(["01", "02", "03"]);
  await expect(page.locator(".status-lines")).toHaveText("3 LINES");
});
