import type { Page } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";

// Seeds unsorted groups once per session (reloads keep the app state), then opens the app.
export async function seedSortableGroups(page: Page) {
  await page.addInitScript((storageKey) => {
    if (sessionStorage.getItem("group-sort-seed")) return;

    const groups = [
      { id: "ungrouped", name: "Ungrouped", createdAt: 0 },
      { id: "zulu", name: "Zulu", createdAt: 1 },
      { id: "daram", name: "다람쥐", createdAt: 2 },
      { id: "alpha", name: "Alpha", createdAt: 3 },
      { id: "namu", name: "나무", createdAt: 4 },
      { id: "gabang", name: "가방", createdAt: 5 },
    ].map(({ id, name, createdAt }, index) => ({
      id,
      name,
      createdAt,
      tabs: [
        {
          id: `tab-${index + 1}`,
          title: name,
          content: "",
          savedContent: "",
          tabColor: "gray",
          pinned: false,
          bookmarked: false,
        },
      ],
      bookmarks: [],
      activeTabId: `tab-${index + 1}`,
      rightTabIds: [],
      activeRightTabId: null,
      activePane: "left",
      splitRatio: 0.5,
    }));

    localStorage.setItem(
      storageKey,
      JSON.stringify({ state: { activeGroupId: "ungrouped", groups }, version: 0 }),
    );
    sessionStorage.setItem("group-sort-seed", "true");
  }, STORAGE_KEY);
  await page.goto("/");
}
