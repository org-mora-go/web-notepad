import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, DESKTOP_VIEWPORT } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("8. PC 명령 구분자는 양옆 9px 간격으로 표시하고 모바일에서는 숨긴다", async ({ page }) => {
  await page.goto("/");
  const closedSeparator = page.locator(".closed-command .status-separator");
  const searchSeparator = page.locator(".global-search-command .status-separator");
  const shortcut = page.locator(".shortcut-command");
  const bookmarkSeparator = bookmarksCommand(page).locator(".status-separator");
  const groupSeparator = page.locator(".group-status-command .status-separator");
  const visibleSeparators = page.locator(".status-meta .status-separator:visible");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(closedSeparator).toHaveCount(1);
    await expect(searchSeparator).toHaveCount(1);
    await expect(bookmarkSeparator).toHaveCount(1);
    await expect(groupSeparator).toHaveCount(0);
    await expect(bookmarkSeparator).toHaveText("|");
    const expectedMargin = "9px";
    for (const separator of [searchSeparator, closedSeparator, bookmarkSeparator]) {
      await expect(separator).toHaveCSS("margin-left", expectedMargin);
      await expect(separator).toHaveCSS("margin-right", expectedMargin);
    }
    if (viewport === DESKTOP_VIEWPORT) {
      await expect(shortcut.locator(".status-separator")).toHaveCount(0);
      await expect(visibleSeparators).toHaveCount(3);
    } else {
      await expect(shortcut).toBeHidden();
      await expect(searchSeparator).toBeHidden();
      await expect(closedSeparator).toBeHidden();
      await expect(bookmarkSeparator).toBeHidden();
      await expect(visibleSeparators).toHaveCount(0);
    }
  }
});
