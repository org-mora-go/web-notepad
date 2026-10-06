import type { StateCreator } from "zustand";

import type { NotepadState, TabColor } from "../type";
import { createNoteTab, getNextTabNumber, getTitleFromContent } from "../util";
import {
  getActiveGroup,
  getAllTabs,
  getReservedTabIds,
  updateGroup,
} from "./workspace";

type TabActions = Pick<
  NotepadState,
  | "addTab"
  | "selectTab"
  | "updateTab"
  | "moveTab"
  | "cycleTabColor"
  | "togglePin"
  | "closeTab"
>;

const TAB_COLORS: TabColor[] = ["green", "gray", "red"];

export const createTabActions: StateCreator<
  NotepadState,
  [],
  [],
  TabActions
> = (set, get) => ({
  addTab: (pane = "left") => {
    const state = get();
    const group = getActiveGroup(state);
    if (!group) return;
    const number = getNextTabNumber(
      getAllTabs(state),
      getReservedTabIds(state),
      state.nextTabNumber,
    );
    const tab = createNoteTab(number);
    const toRight = pane === "right" && group.rightTabIds.length > 0;

    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: [...current.tabs, tab],
        rightTabIds: toRight
          ? [...current.rightTabIds, tab.id]
          : current.rightTabIds,
        splitRatio: toRight ? 0.5 : current.splitRatio,
        activeRightTabId: toRight ? tab.id : current.activeRightTabId,
        activeTabId: toRight ? current.activeTabId : tab.id,
        activePane: toRight ? "right" : "left",
      })),
      nextTabNumber: number + 1,
    });
  },
  selectTab: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      return updateGroup(state, group.id, (current) =>
        current.rightTabIds.includes(tabId)
          ? { ...current, activeRightTabId: tabId, activePane: "right" }
          : { ...current, activeTabId: tabId, activePane: "left" },
      );
    }),
  updateTab: (tabId, content) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const nextContent = typeof content === "string" ? content : "";
      const nextTitle = getTitleFromContent(nextContent, tab.title);
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: current.tabs.map((item) =>
          item.id === tabId
            ? {
                ...item,
                title: nextTitle,
                content: nextContent,
                updatedAt: Date.now(),
              }
            : item,
        ),
        bookmarks: current.bookmarks.map((bookmark) =>
          bookmark.sourceTabId === tabId
            ? { ...bookmark, title: nextTitle, content: nextContent }
            : bookmark,
        ),
      }));
    }),
  moveTab: (fromTabId, toTabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      const from = group.tabs.findIndex((tab) => tab.id === fromTabId);
      const to = group.tabs.findIndex((tab) => tab.id === toTabId);
      if (from < 0 || to < 0 || from === to) return state;

      const tabs = [...group.tabs];
      const [moved] = tabs.splice(from, 1);
      tabs.splice(to, 0, moved);
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs,
      }));
    }),
  cycleTabColor: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const colorIndex = TAB_COLORS.indexOf(tab.tabColor);
      const nextColor = TAB_COLORS[(colorIndex + 1) % TAB_COLORS.length];
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: current.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, tabColor: nextColor } : tab,
        ),
      }));
    }),
  togglePin: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: current.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, pinned: !tab.pinned } : tab,
        ),
      }));
    }),
  closeTab: (tabId) => {
    const state = get();
    const group = getActiveGroup(state);
    const tab = group?.tabs.find((item) => item.id === tabId);
    if (!tab || tab.pinned) return;

    const remainingTabs = group.tabs.filter((item) => item.id !== tabId);
    if (remainingTabs.length === 0) {
      const number = getNextTabNumber(
        getAllTabs(state),
        getReservedTabIds(state),
        state.nextTabNumber,
      );
      const replacement = createNoteTab(number);
      set({
        ...updateGroup(state, group.id, (current) => ({
          ...current,
          tabs: [replacement],
          activeTabId: replacement.id,
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
        })),
        nextTabNumber: number + 1,
      });
      return;
    }

    const wasRight = group.rightTabIds.includes(tabId);
    const rightTabIds = group.rightTabIds.filter((id) => id !== tabId);
    const paneIds = group.tabs
      .filter((item) => group.rightTabIds.includes(item.id) === wasRight)
      .map((item) => item.id);
    const closedIndex = paneIds.indexOf(tabId);
    const nextPaneIds = paneIds.filter((id) => id !== tabId);
    const fallbackId =
      nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)];

    if (wasRight) {
      set({
        ...updateGroup(state, group.id, (current) => ({
          ...current,
          tabs: remainingTabs,
          rightTabIds,
          activePane: rightTabIds.length === 0 ? "left" : "right",
          activeRightTabId:
            rightTabIds.length === 0
              ? null
              : current.activeRightTabId === tabId
                ? fallbackId
                : current.activeRightTabId,
        })),
      });
      return;
    }

    if (nextPaneIds.length === 0) {
      set({
        ...updateGroup(state, group.id, (current) => ({
          ...current,
          tabs: remainingTabs,
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
          activeTabId: current.activeRightTabId ?? remainingTabs[0].id,
        })),
      });
      return;
    }

    set({
      ...updateGroup(state, group.id, (current) => ({
        ...current,
        tabs: remainingTabs,
        rightTabIds,
        activeTabId:
          current.activeTabId === tabId ? fallbackId : current.activeTabId,
      })),
    });
  },
});
