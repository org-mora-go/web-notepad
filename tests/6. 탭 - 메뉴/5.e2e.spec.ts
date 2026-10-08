import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { createPinnedAndBookmarkedTabs } from "../__util__";

test("5. 모바일에서 핀·북마크 아이콘을 더블탭하면 해당 탭의 메뉴를 연다", async ({ page }) => {
  await page.goto("/");
  const menuItem = (name: string) => page.getByRole("menuitem", { name, exact: true });
  const { pinnedTab, bookmarkedTab } = await createPinnedAndBookmarkedTabs(page);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await pinnedTab.locator('[role="tab"]').click();
  await pinnedTab.locator(".tab-pin-indicator").dblclick();
  await expect(menuItem("Unpin")).toBeVisible();
  await expect(menuItem("Bookmark")).toBeVisible();
  await page.keyboard.press("Escape");

  await bookmarkedTab.locator('[role="tab"]').click();
  await bookmarkedTab.locator(".tab-bookmark-indicator").dblclick();
  await expect(menuItem("Pin")).toBeVisible();
  await expect(menuItem("Remove bookmark")).toBeVisible();
});
