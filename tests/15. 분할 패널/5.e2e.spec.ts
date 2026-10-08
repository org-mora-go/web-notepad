import { expect, test } from "@playwright/test";

import { confirmTabDelete } from "../__util__";
import { seedSplitState } from "./__util__";

test("5. 오른쪽 패널의 탭을 모두 옮기거나 닫으면 분할 화면이 해제된다", async ({ page }) => {
  await seedSplitState(page);
  const leftPane = page.locator(".pane-slot").nth(0);
  const rightPane = page.locator(".pane-slot").nth(1);
  await expect(page.locator(".body")).toHaveCount(2);
  await rightPane.locator(".tab-item").first().dragTo(leftPane.locator(".header"));
  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator(".tab-title")).toHaveText([/^left$/i, /^right$/i]);

  await page.locator(".tab-item").filter({ hasText: /^right$/i }).locator('[role="tab"]').click();
  await page.locator("textarea").press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);
  await rightPane.getByRole("button", { name: "새 탭 추가" }).click();
  await expect(rightPane.locator(".tab-item")).toHaveCount(2);
  await rightPane.locator(".tab-item").nth(1).locator(".tab-close").click();
  await expect(rightPane.locator(".tab-item")).toHaveCount(1);
  await rightPane.locator(".tab-close").click();
  await confirmTabDelete(page);
  await expect(page.locator(".body")).toHaveCount(1);
});
