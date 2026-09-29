import type { StateCreator } from "zustand";

import type { NotepadState } from "../type";
import { createNoteTab, getNextTabNumber, getTitleFromContent, sortPinnedFirst } from "../util";

type TabActions = Pick<
  NotepadState,
  "addTab" | "selectTab" | "updateTab" | "moveTab" | "toggleUrgent" | "togglePin" | "closeTab"
>;

export const createTabActions: StateCreator<NotepadState, [], [], TabActions> = (set, get) => ({
  addTab: (pane = "left") => {
    const state = get();
    const number = getNextTabNumber(state.tabs);
    const tab = createNoteTab(number);
    const toRight = pane === "right" && state.rightTabIds.length > 0;

    set({
      tabs: [...state.tabs, tab],
      rightTabIds: toRight ? [...state.rightTabIds, tab.id] : state.rightTabIds,
      activeRightTabId: toRight ? tab.id : state.activeRightTabId,
      activeTabId: toRight ? state.activeTabId : tab.id,
      activePane: toRight ? "right" : "left",
      nextTabNumber: number + 1,
    });
  },
  selectTab: (tabId) =>
    set((state) =>
      state.rightTabIds.includes(tabId)
        ? { activeRightTabId: tabId, activePane: "right" }
        : { activeTabId: tabId, activePane: "left" },
    ),
  updateTab: (tabId, content) =>
    set((state) => {
      const tab = state.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const nextContent = typeof content === "string" ? content : "";
      const nextTitle = getTitleFromContent(nextContent, tab.title);
      return {
        tabs: state.tabs.map((item) =>
          item.id === tabId
            ? { ...item, title: nextTitle, content: nextContent, updatedAt: Date.now() }
            : item,
        ),
        bookmarks: state.bookmarks.map((bookmark) =>
          bookmark.sourceTabId === tabId
            ? { ...bookmark, title: nextTitle, content: nextContent }
            : bookmark,
        ),
      };
    }),
  moveTab: (fromTabId, toTabId) =>
    set((state) => {
      const from = state.tabs.findIndex((tab) => tab.id === fromTabId);
      const to = state.tabs.findIndex((tab) => tab.id === toTabId);
      if (from < 0 || to < 0 || from === to) return state;

      const tabs = [...state.tabs];
      const [moved] = tabs.splice(from, 1);
      tabs.splice(to, 0, moved);
      return { tabs: sortPinnedFirst(tabs) };
    }),
  toggleUrgent: (tabId) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, urgent: !tab.urgent } : tab,
      ),
    })),
  togglePin: (tabId) =>
    set((state) => ({
      tabs: sortPinnedFirst(
        state.tabs.map((tab) => (tab.id === tabId ? { ...tab, pinned: !tab.pinned } : tab)),
      ),
    })),
  closeTab: (tabId) => {
    const state = get();
    const tab = state.tabs.find((item) => item.id === tabId);
    if (!tab || tab.pinned) return;

    const remainingTabs = state.tabs.filter((item) => item.id !== tabId);
    if (remainingTabs.length === 0) {
      const replacement = createNoteTab(1);
      set({
        tabs: [replacement],
        activeTabId: replacement.id,
        rightTabIds: [],
        activeRightTabId: null,
        activePane: "left",
      });
      return;
    }

    const wasRight = state.rightTabIds.includes(tabId);
    const rightTabIds = state.rightTabIds.filter((id) => id !== tabId);
    const paneIds = state.tabs
      .filter((item) => state.rightTabIds.includes(item.id) === wasRight)
      .map((item) => item.id);
    const closedIndex = paneIds.indexOf(tabId);
    const nextPaneIds = paneIds.filter((id) => id !== tabId);
    const fallbackId = nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)];

    if (wasRight) {
      set({
        tabs: remainingTabs,
        rightTabIds,
        activePane: rightTabIds.length === 0 ? "left" : "right",
        activeRightTabId:
          rightTabIds.length === 0
            ? null
            : state.activeRightTabId === tabId
              ? fallbackId
              : state.activeRightTabId,
      });
      return;
    }

    if (nextPaneIds.length === 0) {
      set({
        tabs: remainingTabs,
        rightTabIds: [],
        activeRightTabId: null,
        activePane: "left",
        activeTabId: state.activeRightTabId ?? remainingTabs[0].id,
      });
      return;
    }

    set({
      tabs: remainingTabs,
      rightTabIds,
      activeTabId: state.activeTabId === tabId ? fallbackId : state.activeTabId,
    });
  },
});
