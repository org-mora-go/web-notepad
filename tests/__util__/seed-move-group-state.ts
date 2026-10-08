import type { Page } from "@playwright/test";

import type { GroupEntry, NoteTab } from "@/src/entity/notepad";

import { type StoredState, writeStoredState } from "./stored-state";

type Options = { withTarget?: boolean; splitSource?: boolean; sourceRight?: boolean; splitTarget?: boolean };

export async function seedMoveGroupState(page: Page, {
  withTarget = true, splitSource = false, sourceRight = true, splitTarget = false,
}: Options = {}) {
  const createTab = (number: number, content: string): NoteTab => ({
    id: `tab-${number}`, title: content.split("\n")[0], content, savedContent: content,
    selectedLines: [], tabColor: "green", pinned: false, bookmarked: false, updatedAt: 1,
  });
  const movedTab: NoteTab = {
    ...createTab(1, "Move me\nselected line"),
    pinned: true, bookmarked: true, selectedLines: [1], tabColor: "red",
  };
  const createGroup = (id: string, name: string, tabs: NoteTab[]): GroupEntry => ({
    id, name, tabs, bookmarks: [], activeTabId: tabs[0].id, rightTabIds: [],
    activeRightTabId: null, activePane: "left", splitRatio: 0.5, createdAt: 1,
  });
  const source = createGroup("ungrouped", "Ungrouped", [movedTab]);
  source.bookmarks = [{
    id: "bookmark-tab-1", sourceTabId: movedTab.id, title: movedTab.title,
    content: movedTab.content, tabColor: movedTab.tabColor, selectedLines: [1], createdAt: 1,
  }];
  if (splitSource) {
    source.tabs.push(createTab(3, "Keep source note"));
    source.rightTabIds = [sourceRight ? movedTab.id : "tab-3"];
    source.activeTabId = sourceRight ? "tab-3" : movedTab.id;
    source.activeRightTabId = source.rightTabIds[0];
    source.activePane = sourceRight ? "right" : "left";
  }
  const target = createGroup("target", "Target", [createTab(2, "Target note")]);
  if (splitTarget) {
    target.tabs.push(createTab(4, "Target right note"));
    target.rightTabIds = ["tab-4"];
    target.activeRightTabId = "tab-4";
    target.activePane = "right";
  }
  const state: StoredState = {
    groups: withTarget ? [source, target] : [source], activeGroupId: source.id, nextTabNumber: 5,
  };
  await writeStoredState(page, state);
  return state;
}


// The seeded "Move me" tab that the move-group tests act on.
export const moveGroupSourceTab = (page: Page) =>
  page.getByRole("tab", { name: "Move me", exact: true });
