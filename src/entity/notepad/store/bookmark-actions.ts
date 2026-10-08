import type { StateCreator } from "zustand";

import type { NotepadState } from "../type";
import { getTitleFromContent } from "../util";
import {
  activateTab,
  allocateTab,
  getActiveGroup,
  updateGroup,
} from "./workspace";

type BookmarkActions = Pick<
  NotepadState,
  "toggleBookmark" | "openBookmark" | "removeBookmark"
>;

export const createBookmarkActions: StateCreator<
  NotepadState,
  [],
  [],
  BookmarkActions
> = (set, get) => ({
  toggleBookmark: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const existing = group.bookmarks.find(
        (item) => item.sourceTabId === tabId,
      );
      if (existing) {
        return updateGroup(state, group.id, (current) => ({
          ...current,
          tabs: current.tabs.map((item) =>
            item.id === tabId ? { ...item, bookmarked: false } : item,
          ),
          bookmarks: current.bookmarks.filter(
            (item) => item.id !== existing.id,
          ),
        }));
      }

      const createdAt = Date.now();
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: current.tabs.map((item) =>
          item.id === tabId ? { ...item, bookmarked: true } : item,
        ),
        bookmarks: [
          {
            id: `bookmark-${tabId}`,
            sourceTabId: tabId,
            title: getTitleFromContent(tab.content, tab.title),
            content: tab.content,
            tabColor: tab.tabColor,
            selectedLines: [...tab.selectedLines],
            createdAt,
          },
          ...current.bookmarks,
        ],
      }));
    }),
  openBookmark: (bookmarkId) => {
    const state = get();
    const group = getActiveGroup(state);
    const bookmark = group?.bookmarks.find((item) => item.id === bookmarkId);
    if (!bookmark) return;

    const sourceTab = group.tabs.find((tab) => tab.id === bookmark.sourceTabId);
    if (sourceTab) {
      set(updateGroup(state, group.id, (current) => activateTab(current, sourceTab.id)));
      return;
    }

    const { tab: blankTab, number } = allocateTab(state);
    const sourceTabId = bookmark.sourceTabId || blankTab.id;
    const tab = {
      ...blankTab,
      id: sourceTabId,
      title: bookmark.title,
      content: bookmark.content,
      savedContent: bookmark.content,
      tabColor: bookmark.tabColor,
      selectedLines: [...bookmark.selectedLines],
      bookmarked: true,
      updatedAt: bookmark.createdAt,
    };
    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: [...current.tabs, tab],
        bookmarks: current.bookmarks.map((item) =>
          item.id === bookmarkId ? { ...item, sourceTabId } : item,
        ),
        activeTabId: tab.id,
        activePane: "left",
      })),
      nextTabNumber: Math.max(state.nextTabNumber, number + 1),
    });
  },
  removeBookmark: (bookmarkId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      const bookmark = group.bookmarks.find((item) => item.id === bookmarkId);
      if (!bookmark) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        bookmarks: current.bookmarks.filter((item) => item.id !== bookmarkId),
        tabs: current.tabs.map((tab) =>
          tab.id === bookmark.sourceTabId ? { ...tab, bookmarked: false } : tab,
        ),
      }));
    }),
});
