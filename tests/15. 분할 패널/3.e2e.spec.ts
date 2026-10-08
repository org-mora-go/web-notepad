import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("3. 각 패널은 자체 탭 목록과 활성 탭을 가진다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  const leftPane = page.locator(".pane-slot").nth(0);
  const rightPane = page.locator(".pane-slot").nth(1);
  await expect(leftPane.locator(".tab-title")).toHaveText([/^left$/i]);
  await expect(rightPane.locator(".tab-title")).toHaveText([/^right$/i]);

  await rightPane.getByRole("button", { name: "새 탭 추가" }).click();
  await rightPane.locator("textarea").fill("right two");
  await expect(rightPane.locator(".tab-title")).toHaveText([/^right$/i, "right two"]);
  await expect(leftPane.locator(".tab-title")).toHaveText([/^left$/i]);
  await expect(leftPane.locator("textarea")).toHaveValue("left");

  await rightPane.locator('[role="tab"]').first().click();
  await expect(rightPane.locator("textarea")).toHaveValue("right");
  await expect(rightPane.locator(".tab-item.is-active .tab-title")).toHaveText(/^right$/i);
  await expect(leftPane.locator(".tab-item.is-active .tab-title")).toHaveText(/^left$/i);
  await expect(leftPane.locator("textarea")).toHaveValue("left");
});
