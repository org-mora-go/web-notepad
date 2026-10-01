import type { Page } from "@playwright/test";

export async function seedSplitState(page: Page) {
  await page.addInitScript(() => {
    const tabs = [
      {
        id: "left",
        title: "Left",
        content: "left",
        savedContent: "left",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 1,
      },
      {
        id: "right",
        title: "Right",
        content: "right",
        savedContent: "right",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 2,
      },
    ];
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          activeGroupId: "ungrouped",
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              createdAt: 0,
              tabs,
              bookmarks: [],
              activeTabId: "left",
              rightTabIds: ["right"],
              activeRightTabId: "right",
              activePane: "left",
              splitRatio: 0.5,
            },
          ],
        },
        version: 0,
      }),
    );
  });
}
