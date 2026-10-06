import { UNGROUPED_GROUP_ID } from "../constant";
import type { BookmarkEntry, GroupEntry, NotepadState, NoteTab } from "../type";
import { createNoteTab } from "./note-tab";

const normalizeTabs = (value: unknown, fallback: NoteTab[]): NoteTab[] =>
  (Array.isArray(value) ? value : fallback)
    .filter((tab) => tab && typeof tab.id === "string")
    .map((tab) => {
      const { urgent, ...tabData } = tab;
      const tabColor =
        tab.tabColor === "gray" ||
        tab.tabColor === "red" ||
        tab.tabColor === "green"
          ? tab.tabColor
          : tab.tabColor === "blue"
            ? "red"
            : urgent === false
              ? "gray"
              : "green";

      return {
        ...tabData,
        title: typeof tab.title === "string" ? tab.title : "Untitled",
        content: typeof tab.content === "string" ? tab.content : "",
        savedContent:
          typeof tab.savedContent === "string" ? tab.savedContent : "",
        tabColor,
        pinned: Boolean(tab.pinned),
        bookmarked: Boolean(tab.bookmarked),
      };
    });

const normalizeBookmarks = (value: unknown, fallback: BookmarkEntry[]) =>
  (Array.isArray(value) ? value : fallback)
    .filter((bookmark) => bookmark && typeof bookmark.id === "string")
    .map((bookmark) => ({
      ...bookmark,
      sourceTabId:
        typeof bookmark.sourceTabId === "string" ? bookmark.sourceTabId : "",
      title: typeof bookmark.title === "string" ? bookmark.title : "Untitled",
      content: typeof bookmark.content === "string" ? bookmark.content : "",
      createdAt:
        typeof bookmark.createdAt === "number" &&
        Number.isFinite(bookmark.createdAt)
          ? bookmark.createdAt
          : Date.now(),
    }));

export function normalizePersistedState(
  persistedState: unknown,
  currentState: NotepadState,
): NotepadState {
  const persisted = {
    ...(persistedState as Partial<NotepadState> & {
      tabs?: unknown;
      bookmarks?: unknown;
      activeTabId?: unknown;
      rightTabIds?: unknown;
      activeRightTabId?: unknown;
      activePane?: unknown;
      splitRatio?: unknown;
      unsavedSnapshots?: unknown;
      nextUnsavedNumber?: unknown;
    }),
  };
  delete persisted.unsavedSnapshots;
  delete persisted.nextUnsavedNumber;
  const hasLegacyTabs = Array.isArray(persisted.tabs);
  const legacyTabs = normalizeTabs(persisted.tabs, currentState.groups[0].tabs);
  const legacyBookmarks = normalizeBookmarks(
    persisted.bookmarks,
    currentState.groups[0].bookmarks,
  );
  const sourceGroups = Array.isArray(persisted.groups)
    ? persisted.groups
    : currentState.groups;
  let nextTabNumber =
    typeof persisted.nextTabNumber === "number" &&
    Number.isFinite(persisted.nextTabNumber)
      ? persisted.nextTabNumber
      : currentState.nextTabNumber;
  const reservedTabIds = new Set([
    ...legacyTabs.map((tab) => tab.id),
    ...legacyBookmarks.map((bookmark) => bookmark.sourceTabId),
    ...sourceGroups.flatMap((group) =>
      Array.isArray(group.tabs)
        ? group.tabs
            .filter((tab) => tab && typeof tab.id === "string")
            .map((tab) => tab.id)
        : [],
    ),
  ]);
  while (reservedTabIds.has(`tab-${nextTabNumber}`)) nextTabNumber += 1;

  const groups: GroupEntry[] = sourceGroups
    .filter((group) => group && typeof group.id === "string")
    .map((group) => {
      const id = group.id;
      const hasWorkspace = Array.isArray(group.tabs);
      let tabs = hasWorkspace
        ? normalizeTabs(group.tabs, [])
        : id === UNGROUPED_GROUP_ID
          ? legacyTabs
          : [createLegacyGroupTab()];
      if (tabs.length === 0) tabs = [createLegacyGroupTab()];
      const bookmarks = hasWorkspace
        ? normalizeBookmarks(group.bookmarks, [])
        : id === UNGROUPED_GROUP_ID
          ? legacyBookmarks
          : [];
      const tabIds = new Set(tabs.map((tab) => tab.id));
      const sourceRightTabIds = hasWorkspace
        ? group.rightTabIds
        : id === UNGROUPED_GROUP_ID
          ? persisted.rightTabIds
          : [];
      const rightTabIds = Array.isArray(sourceRightTabIds)
        ? sourceRightTabIds.filter(
            (tabId): tabId is string =>
              typeof tabId === "string" && tabIds.has(tabId),
          )
        : [];
      const sourceActiveTabId = hasWorkspace
        ? group.activeTabId
        : id === UNGROUPED_GROUP_ID
          ? persisted.activeTabId
          : null;
      const activeTabId =
        typeof sourceActiveTabId === "string" && tabIds.has(sourceActiveTabId)
          ? sourceActiveTabId
          : (tabs[0]?.id ?? "");
      const sourceActiveRightTabId = hasWorkspace
        ? group.activeRightTabId
        : id === UNGROUPED_GROUP_ID
          ? persisted.activeRightTabId
          : null;
      const sourceActivePane = hasWorkspace
        ? group.activePane
        : id === UNGROUPED_GROUP_ID
          ? persisted.activePane
          : "left";
      return {
        id,
        name: typeof group.name === "string" ? group.name : "Untitled Group",
        createdAt:
          typeof group.createdAt === "number" &&
          Number.isFinite(group.createdAt)
            ? group.createdAt
            : Date.now(),
        tabs,
        bookmarks,
        activeTabId,
        rightTabIds,
        activeRightTabId:
          typeof sourceActiveRightTabId === "string" &&
          rightTabIds.includes(sourceActiveRightTabId)
            ? sourceActiveRightTabId
            : (rightTabIds[0] ?? null),
        activePane:
          sourceActivePane === "right" && rightTabIds.length > 0
            ? "right"
            : "left",
        splitRatio: 0.5,
      };
    });

  const ungrouped = groups.find((group) => group.id === UNGROUPED_GROUP_ID);
  if (!ungrouped) {
    groups.unshift({
      ...currentState.groups[0],
      tabs:
        hasLegacyTabs && legacyTabs.length > 0
          ? legacyTabs
          : [createLegacyGroupTab()],
      bookmarks: legacyBookmarks,
    });
  }

  const requestedActiveGroupId = persisted.activeGroupId;
  const activeGroupId =
    typeof requestedActiveGroupId === "string" &&
    groups.some((group) => group.id === requestedActiveGroupId)
      ? requestedActiveGroupId
      : UNGROUPED_GROUP_ID;
  delete persisted.tabs;
  delete persisted.bookmarks;
  delete persisted.activeTabId;
  delete persisted.rightTabIds;
  delete persisted.activeRightTabId;
  delete persisted.activePane;
  delete persisted.splitRatio;

  return {
    ...currentState,
    ...persisted,
    groups,
    activeGroupId,
    nextTabNumber,
  };

  function createLegacyGroupTab(): NoteTab {
    while (reservedTabIds.has(`tab-${nextTabNumber}`)) nextTabNumber += 1;
    const tab = createNoteTab(nextTabNumber);
    reservedTabIds.add(tab.id);
    nextTabNumber += 1;
    return tab;
  }
}
