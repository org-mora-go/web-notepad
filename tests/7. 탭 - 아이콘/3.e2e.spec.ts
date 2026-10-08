import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { createPinnedAndBookmarkedTabs } from "../__util__";

test("3. 핀·북마크 아이콘을 클릭하면 탭을 선택하고 상태를 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const { pinnedTab, bookmarkedTab } = await createPinnedAndBookmarkedTabs(page);

  const pinIcon = pinnedTab.locator(".tab-pin-indicator");
  const bookmarkIcon = bookmarkedTab.locator(".tab-bookmark-indicator");
  await expect(pinnedTab.locator('[role="tab"] .tab-pin-indicator')).toHaveCount(1);
  await expect(bookmarkedTab.locator('[role="tab"] .tab-bookmark-indicator')).toHaveCount(1);

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await pinIcon.click();
    await expect(editor).toHaveValue("pinned note");
    await expect(pinnedTab).toHaveClass(/is-pinned/);
    await bookmarkIcon.click();
    await expect(editor).toHaveValue("bookmarked note");
    await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
    await expect(page.getByRole("menu")).toHaveCount(0);
  }
});
