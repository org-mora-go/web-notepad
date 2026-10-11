import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("2. PC 그룹 명령은 이름과 개수를, 모바일은 고정 GROUP 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(1);
  await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator("svg")).toHaveCount(1);
  await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
  await expect(groupCommand.locator(".group-status-name")).toBeHidden();
  await expect(groupCommand.locator(".status-count")).toBeHidden();
  await expect(groupCommand.locator(".group-status-label")).toHaveText("GROUP");
  await expect(groupCommand.locator(".group-status-label")).toBeInViewport();
});
