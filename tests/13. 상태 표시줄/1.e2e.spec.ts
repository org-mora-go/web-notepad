import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 노트의 전체 줄 수를 표시하지 않는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo");
  await expect(page.locator(".status-meta")).not.toContainText(/\b\d+ LINES\b/);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".status-meta")).not.toContainText(/\b\d+ LINES\b/);
});
