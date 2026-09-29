import type { StateCreator } from "zustand";

import type { NotepadState } from "../type";
import { createNoteTab, getNextTabNumber, getTitleFromContent } from "../util";

type BookmarkActions = Pick<NotepadState, "toggleBookmark" | "openBookmark" | "removeBookmark">;

export const createBookmarkActions: StateCreator<NotepadState, [], [], BookmarkActions> = (
  set,
  get,
) => ({
  toggleBookmark: (tabId) =>
    set((state) => {
      const tab = state.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const existing = state.bookmarks.find((item) => item.sourceTabId === tabId);
      if (existing) {
        return {
          tabs: state.tabs.map((item) =>
            item.id === tabId ? { ...item, bookmarked: false } : item,
          ),
          bookmarks: state.bookmarks.filter((item) => item.id !== existing.id),
        };
      }

      const createdAt = Date.now();
      return {
        tabs: state.tabs.map((item) =>
          item.id === tabId ? { ...item, bookmarked: true } : item,
        ),
        bookmarks: [
          {
            id: `bookmark-${tabId}`,
            sourceTabId: tabId,
            title: getTitleFromContent(tab.content, tab.title),
            content: tab.content,
            createdAt,
          },
          ...state.bookmarks,
        ],
      };
    }),
  openBookmark: (bookmarkId) => {
    const state = get();
    const bookmark = state.bookmarks.find((item) => item.id === bookmarkId);
    if (!bookmark) return;

    const sourceTab = state.tabs.find((tab) => tab.id === bookmark.sourceTabId);
    if (sourceTab) {
      const inRightPane = state.rightTabIds.includes(sourceTab.id);
      set(
        inRightPane
          ? { activeRightTabId: sourceTab.id, activePane: "right" }
          : { activeTabId: sourceTab.id, activePane: "left" },
      );
      return;
    }

    const number = getNextTabNumber(state.tabs);
    const sourceTabId = bookmark.sourceTabId || `tab-${number}`;
    const tab = {
      ...createNoteTab(number),
      id: sourceTabId,
      title: bookmark.title,
      content: bookmark.content,
      savedContent: bookmark.content,
      bookmarked: true,
      updatedAt: bookmark.createdAt,
    };
    set({
      tabs: [...state.tabs, tab],
      bookmarks: state.bookmarks.map((item) =>
        item.id === bookmarkId ? { ...item, sourceTabId } : item,
      ),
      activeTabId: tab.id,
      nextTabNumber: Math.max(state.nextTabNumber, number + 1),
      activePane: "left",
    });
  },
  removeBookmark: (bookmarkId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
      tabs: state.tabs.map((tab) =>
        state.bookmarks.some(
          (bookmark) => bookmark.id === bookmarkId && bookmark.sourceTabId === tab.id,
        )
          ? { ...tab, bookmarked: false }
          : tab,
      ),
    })),
});
