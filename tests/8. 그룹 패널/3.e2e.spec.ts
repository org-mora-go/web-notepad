import { expect, test } from "@playwright/test";

test("3. 모바일에서도 그룹 수를 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await expect(page.locator(".group-status-command .status-count")).toHaveText("(1)");
  await expect(page.locator(".group-status-command .status-count")).toBeInViewport();
});
