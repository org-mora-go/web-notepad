import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("2. 상태 표시줄 그룹 명령에 현재 그룹 이름과 그룹 수를 표시하며 모바일에서도 그룹 수를 표시한다", async ({ page }) => {
  await page.goto("/");
  const groupCommand = page.locator(".group-status-command");
  const groupCount = groupCommand.locator(".status-count");
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCount).toHaveText("(1)");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(groupCount).toHaveText("(1)");
  await expect(groupCount).toBeInViewport();
});
