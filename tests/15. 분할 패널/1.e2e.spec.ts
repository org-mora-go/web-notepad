import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("1. 탭을 좌우 패널 사이로 드래그해 이동한다", async ({ page }) => {
  await seedSplitState(page);
  const leftPane = page.locator(".pane-slot").nth(0);
  const rightPane = page.locator(".pane-slot").nth(1);
  const paneTab = (pane: typeof leftPane, title: RegExp) =>
    pane.locator(".tab-item").filter({ hasText: title });
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(leftPane.locator("textarea")).toHaveValue("left");
  await expect(rightPane.locator("textarea")).toHaveValue("right");

  await leftPane.getByRole("button", { name: "새 탭 추가" }).click();
  await leftPane.locator("textarea").fill("extra");
  await expect(leftPane.locator(".tab-item")).toHaveCount(2);

  await paneTab(leftPane, /^left$/i).dragTo(rightPane.locator(".header"));
  await expect(leftPane.locator(".tab-item")).toHaveCount(1);
  await expect(paneTab(leftPane, /^extra$/)).toHaveCount(1);
  await expect(rightPane.locator(".tab-item")).toHaveCount(2);
  await expect(paneTab(rightPane, /^left$/i)).toHaveCount(1);
  await expect(paneTab(rightPane, /^right$/i)).toHaveCount(1);

  await paneTab(rightPane, /^right$/i).dragTo(leftPane.locator(".header"));
  await expect(leftPane.locator(".tab-item")).toHaveCount(2);
  await expect(paneTab(leftPane, /^right$/i)).toHaveCount(1);
  await expect(paneTab(leftPane, /^extra$/)).toHaveCount(1);
  await expect(rightPane.locator(".tab-item")).toHaveCount(1);
  await expect(paneTab(rightPane, /^left$/i)).toHaveCount(1);
  await expect(page.locator(".body")).toHaveCount(2);
});
