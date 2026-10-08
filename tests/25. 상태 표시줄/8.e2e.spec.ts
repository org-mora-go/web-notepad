import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, DESKTOP_VIEWPORT } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("8. PC와 모바일에서 명령 사이에만 구분자를 표시하고 양옆 간격을 적용한다", async ({ page }) => {
  await page.goto("/");
  const closedSeparator = page.locator(".closed-command .status-separator");
  const shortcut = page.locator(".shortcut-command");
  const shortcutSeparator = shortcut.locator(".status-separator");
  const bookmarkSeparator = bookmarksCommand(page).locator(".status-separator");
  const groupSeparator = page.locator(".group-status-command .status-separator");
  const visibleSeparators = page.locator(".status-meta .status-separator:visible");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(closedSeparator).toHaveCount(1);
    await expect(shortcutSeparator).toHaveCount(1);
    await expect(bookmarkSeparator).toHaveCount(1);
    await expect(groupSeparator).toHaveCount(0);
    await expect(bookmarkSeparator).toHaveText("|");
    const expectedMargin = viewport === DESKTOP_VIEWPORT ? "9px" : "6px";
    for (const separator of [closedSeparator, shortcutSeparator, bookmarkSeparator]) {
      await expect(separator).toHaveCSS("margin-left", expectedMargin);
      await expect(separator).toHaveCSS("margin-right", expectedMargin);
    }
    if (viewport === DESKTOP_VIEWPORT) {
      await expect(shortcutSeparator).toBeVisible();
      await expect(visibleSeparators).toHaveCount(3);
    } else {
      await expect(shortcut).toBeHidden();
      await expect(shortcutSeparator).toBeHidden();
      await expect(closedSeparator).toBeVisible();
      await expect(visibleSeparators).toHaveCount(2);
    }
  }
});
