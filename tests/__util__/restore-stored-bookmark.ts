import type { Page } from "@playwright/test";

import { bookmarksCommand } from "./panel";
import { seedStoredStateOnLoad } from "./stored-state";

type BookmarkMetadata = {
  tabColor?: string;
  selectedLines?: unknown[];
};

export async function restoreStoredBookmark(page: Page, { tabColor, selectedLines }: BookmarkMetadata) {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      tabs: [{ id: "tab-1", content: "" }],
      bookmarks: [{
        id: "old-bookmark",
        sourceTabId: "closed-note",
        title: "Old bookmark",
        content: "one\ntwo\nthree",
        tabColor,
        selectedLines,
        createdAt: 1,
      }],
    }],
  });
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "열기" }).click();
}
