import type { ClosedTabEntry, GroupEntry, NoteTab } from "@/src/entity/notepad";

// A saved note tab whose title is its first line, as the app stores it.
export const createTabFixture = (
  id: string,
  content: string,
  overrides: Partial<NoteTab> = {},
): NoteTab => ({
  id,
  title: content.split("\n")[0],
  content,
  savedContent: content,
  selectedLines: [],
  tabColor: "green",
  pinned: false,
  bookmarked: false,
  updatedAt: 1,
  ...overrides,
});

// A group workspace with every tab in the left pane and the first one active.
export const createGroupFixture = (
  id: string,
  name: string,
  tabs: NoteTab[],
  overrides: Partial<GroupEntry> = {},
): GroupEntry => ({
  id,
  name,
  createdAt: 1,
  tabs,
  bookmarks: [],
  activeTabId: tabs[0].id,
  rightTabIds: [],
  activeRightTabId: null,
  activePane: "left",
  splitRatio: 0.5,
  ...overrides,
});

export const createClosedTabFixture = (
  id: string,
  groupId: string,
  tab: NoteTab,
): ClosedTabEntry => ({ id, groupId, tab, closedAt: 1 });
