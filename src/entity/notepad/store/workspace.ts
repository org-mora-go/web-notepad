import type {
  BookmarkEntry,
  GroupEntry,
  NotepadState,
  NoteTab,
} from "../type";
import { createNoteTab, getNextTabNumber } from "../util";

export const getActiveGroup = (state: NotepadState) =>
  state.groups.find((group) => group.id === state.activeGroupId) ?? state.groups[0];

export const updateGroup = (
  state: NotepadState,
  groupId: string,
  update: (group: GroupEntry) => GroupEntry,
) => ({
  groups: state.groups.map((group) =>
    group.id === groupId ? update(group) : group,
  ),
});

export const getAllTabs = (state: NotepadState) =>
  state.groups.flatMap((group) => group.tabs);

export const getReservedTabIds = (state: NotepadState) =>
  state.groups.flatMap((group) =>
    group.bookmarks.map((bookmark) => bookmark.sourceTabId),
  );

export const allocateTab = (state: NotepadState) => {
  const number = getNextTabNumber(
    getAllTabs(state),
    getReservedTabIds(state),
    state.nextTabNumber,
  );
  return { tab: createNoteTab(number), number, nextTabNumber: number + 1 };
};

export const createGroupEntry = (
  id: string,
  name: string,
  createdAt: number,
  tab: NoteTab,
): GroupEntry => ({
  id,
  name,
  createdAt,
  tabs: [tab],
  bookmarks: [],
  activeTabId: tab.id,
  rightTabIds: [],
  activeRightTabId: null,
  activePane: "left",
  splitRatio: 0.5,
});

export const activateTab = (group: GroupEntry, tabId: string): GroupEntry =>
  group.rightTabIds.includes(tabId)
    ? { ...group, activeRightTabId: tabId, activePane: "right" }
    : { ...group, activeTabId: tabId, activePane: "left" };

// Applies the same change to a tab and the bookmark linked to it.
export const patchTabAndBookmark = (
  group: GroupEntry,
  tabId: string,
  tabPatch: Partial<NoteTab>,
  bookmarkPatch: Partial<BookmarkEntry> = {},
): GroupEntry => ({
  ...group,
  tabs: group.tabs.map((tab) =>
    tab.id === tabId ? { ...tab, ...tabPatch } : tab,
  ),
  bookmarks: group.bookmarks.map((bookmark) =>
    bookmark.sourceTabId === tabId ? { ...bookmark, ...bookmarkPatch } : bookmark,
  ),
});
