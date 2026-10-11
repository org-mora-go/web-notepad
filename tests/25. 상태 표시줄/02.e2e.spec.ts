import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("2. PC 그룹 선택에는 이름과 수를, 모바일 메뉴에는 GROUP 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(groupCommand.locator("svg")).toHaveCount(1);
    if (viewport.width <= 640) {
      await expect(groupCommand.locator(".group-status-name")).toBeHidden();
      await expect(groupCommand.locator(".status-count")).toBeHidden();
      await expect(groupCommand.locator(".group-status-label")).toHaveText("GROUP");
      await expect(groupCommand.locator(".group-status-label")).toBeInViewport();
      await expect(page.locator(".current-group-name")).toHaveText("Ungrouped");
      await expect(page.locator(".current-group-panel")).toBeVisible();
    } else {
      await expect(groupCommand.locator(".group-status-name")).toHaveText("Ungrouped");
      await expect(groupCommand.locator(".group-status-name")).toBeVisible();
      await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
      await expect(groupCommand.locator(".status-count")).toBeVisible();
      await expect(groupCommand.locator(".group-status-label")).toBeHidden();
      await expect(page.locator(".current-group-panel")).toBeHidden();
    }
  }
});
