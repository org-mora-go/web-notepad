import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("2. 상태 표시줄 그룹 명령에는 현재 그룹 이름만 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(0);
  await expect(groupCommand.locator(".status-count")).toHaveCount(0);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(0);
  await expect(groupCommand.locator(".status-count")).toHaveCount(0);
  await expect(groupCommand.locator(".group-status-name")).toBeInViewport();
});
