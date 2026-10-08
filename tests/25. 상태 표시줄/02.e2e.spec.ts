import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("2. 상태 표시줄 그룹 명령에 아이콘, 현재 그룹 이름과 그룹 수를 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(1);
  await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(1);
  await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
  await expect(groupCommand.locator(".group-status-name")).toBeInViewport();
  await expect(groupCommand.locator(".status-count")).toBeInViewport();
});
