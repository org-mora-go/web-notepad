import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("8. PC와 모바일의 하단 메뉴 구분자를 모두 숨긴다", async ({ page }) => {
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
    for (const separator of [searchSeparator, closedSeparator, bookmarkSeparator]) {
      await expect(separator).toBeHidden();
    }
    await expect(shortcut.locator(".status-separator")).toHaveCount(0);
    await expect(visibleSeparators).toHaveCount(0);
  }
});
