import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__/seed-split-state";

test("a. 탭을 좌우 패널로 이동하면 분할 화면에 두 패널이 표시된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  await expect(page.locator(".note-pane-body")).toHaveCount(2);
  await expect(page.locator(".note-pane-body").nth(0).locator("textarea")).toHaveValue("left");
  await expect(page.locator(".note-pane-body").nth(1).locator("textarea")).toHaveValue("right");
});
