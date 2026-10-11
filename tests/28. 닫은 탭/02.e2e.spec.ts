import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("2. SHORTCUT 오른쪽에 CLOSED 명령과 닫은 탭 개수를 PC와 모바일에서 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  const command = closedCommand(page);
  const label = command.locator(".status-label");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  const commandBox = await command.boundingBox();
  const shortcutBox = await page.locator(".shortcut-command").boundingBox();
  expect(shortcutBox!.x + shortcutBox!.width).toBeLessThanOrEqual(commandBox!.x + 1);
  await expect(label).toHaveText("CLOSED");
  await expect(label).toBeVisible();
  await expect(command.locator(".status-count")).toHaveText("(1)");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toBeVisible();
  await expect(command.locator("svg")).toBeInViewport();
  await expect(command.locator(".status-count")).toHaveText("(1)");
  await expect(command.locator(".status-count")).toBeInViewport();
  await expect(page.locator(".group-status-command .group-status-label")).toBeInViewport();
});
