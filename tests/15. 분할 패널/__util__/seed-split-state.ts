import type { Page } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

// Seeds a split view with "left" and "right" tabs on every load, then opens the app.
export async function seedSplitState(page: Page, splitRatio = 0.5) {
  const createTab = (id: string, title: string, updatedAt: number) => ({
    id,
    title,
    content: id,
    savedContent: id,
    urgent: false,
    pinned: false,
    bookmarked: false,
    updatedAt,
  });
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        createdAt: 0,
        tabs: [createTab("left", "Left", 1), createTab("right", "Right", 2)],
        bookmarks: [],
        activeTabId: "left",
        rightTabIds: ["right"],
        activeRightTabId: "right",
        activePane: "left",
        splitRatio,
      },
    ],
  });
}
