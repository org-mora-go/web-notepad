import { expect, type Locator, test } from "@playwright/test";

import { addTabButton, createPinnedAndBookmarkedTabs } from "../__util__";

test("4. 핀·북마크 아이콘에서 드래그하면 탭 전체를 이동하고 상태를 유지한다", async ({ page }) => {
  await page.goto("/");
  const { pinnedTab, bookmarkedTab } = await createPinnedAndBookmarkedTabs(page);
  await addTabButton(page).click();
  await page.locator("textarea").fill("other note");
  const otherTab = page.locator(".tab-item").filter({ hasText: "other note" });
  const pinIcon = pinnedTab.locator(".tab-pin-indicator");
  const bookmarkIcon = bookmarkedTab.locator(".tab-bookmark-indicator");
  const recordDragSource = (tab: Locator) => tab.evaluate((element) => {
    element.addEventListener("dragstart", (event) => {
      element.setAttribute("data-drag-source-is-tab", String(event.target === element));
    }, { once: true });
  });

  await expect(pinIcon).not.toHaveAttribute("draggable", "true");
  await expect(bookmarkIcon).not.toHaveAttribute("draggable", "true");
  await recordDragSource(pinnedTab);
  await pinIcon.dragTo(otherTab);
  await expect(pinnedTab).toHaveAttribute("data-drag-source-is-tab", "true");
  await expect(page.locator(".tab-title")).toHaveText(["bookmarked note", "other note", "pinned note"]);

  await recordDragSource(bookmarkedTab);
  await bookmarkIcon.dragTo(pinnedTab);
  await expect(bookmarkedTab).toHaveAttribute("data-drag-source-is-tab", "true");
  await expect(page.locator(".tab-title")).toHaveText(["other note", "pinned note", "bookmarked note"]);
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await expect(page.getByRole("menu")).toHaveCount(0);
});
