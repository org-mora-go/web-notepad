import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("2. SHORTCUT 왼쪽에 개수 없이 CLOSED 명령을 표시하고 모바일에서는 아이콘만 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  const command = closedCommand(page);
  const label = command.locator(".status-label");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  const commandBox = await command.boundingBox();
  const shortcutBox = await page.locator(".shortcut-command").boundingBox();
  expect(commandBox!.x + commandBox!.width).toBeLessThanOrEqual(shortcutBox!.x + 1);
  await expect(label).toHaveText("CLOSED");
  await expect(label).toBeVisible();
  await expect(command.locator(".status-count")).toHaveCount(0);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toBeHidden();
  await expect(command.locator("svg")).toBeInViewport();
  await expect(command.locator(".status-count")).toHaveCount(0);
  await expect(page.locator(".group-status-command .status-count")).toBeInViewport();
});
