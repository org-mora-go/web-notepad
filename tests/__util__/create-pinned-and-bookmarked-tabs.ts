import type { Page } from "@playwright/test";

import { addTabButton, chooseTabMenuItem } from "./tab";

// Creates a pinned "pinned note" tab followed by an active bookmarked "bookmarked note" tab.
export async function createPinnedAndBookmarkedTabs(page: Page) {
  const editor = page.locator("textarea");
  await editor.fill("pinned note");
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();
  await editor.fill("bookmarked note");
  await chooseTabMenuItem(page, "Bookmark");
  return {
    pinnedTab: page.locator(".tab-item").filter({ hasText: "pinned note" }),
    bookmarkedTab: page.locator(".tab-item").filter({ hasText: "bookmarked note" }),
  };
}
