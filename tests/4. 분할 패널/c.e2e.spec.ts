import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("c. 오른쪽 패널의 탭을 닫으면 분할 화면이 해제된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  await page.locator(".pane-slot").nth(1).locator(".tab-close").click();
  await expect(page.locator(".note-pane-body")).toHaveCount(1);
});
