import type { Page } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";
import { createGroupFixture, createTabFixture } from "../__fixture__";

// Seeds unsorted groups once per session (reloads keep the app state), then opens the app.
export async function seedSortableGroups(page: Page) {
  const groups = [
    ["ungrouped", "Ungrouped"],
    ["zulu", "Zulu"],
    ["daram", "다람쥐"],
    ["alpha", "Alpha"],
    ["namu", "나무"],
    ["gabang", "가방"],
  ].map(([id, name], index) =>
    createGroupFixture(id, name, [createTabFixture(`tab-${index + 1}`, "", { title: name })], {
      createdAt: index,
    }),
  );
  await page.addInitScript(({ storageKey, groups }) => {
    if (sessionStorage.getItem("group-sort-seed")) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ state: { activeGroupId: "ungrouped", groups }, version: 0 }),
    );
    sessionStorage.setItem("group-sort-seed", "true");
  }, { storageKey: STORAGE_KEY, groups });
  await page.goto("/");
}
