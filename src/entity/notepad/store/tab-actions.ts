import type { StateCreator } from "zustand";

import type { NotepadState, TabColor } from "../type";
import { getTitleFromContent, sanitizeSelectedLines } from "../util";
import {
  activateTab,
  allocateTab,
  getActiveGroup,
  patchTabAndBookmark,
  updateGroup,
} from "./workspace";

type TabActions = Pick<
  NotepadState,
  | "addTab"
  | "selectTab"
  | "updateTab"
  | "setTabSelectedLines"
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
    const { tab, nextTabNumber } = allocateTab(state);
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
      nextTabNumber,
    });
  },
  selectTab: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      return updateGroup(state, group.id, (current) => activateTab(current, tabId));
    }),
  updateTab: (tabId, content) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!tab) return state;

      const nextContent = typeof content === "string" ? content : "";
      const nextTitle = getTitleFromContent(nextContent, tab.title);
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { title: nextTitle, content: nextContent, updatedAt: Date.now() },
          { title: nextTitle, content: nextContent },
        ),
      );
    }),
  setTabSelectedLines: (tabId, selectedLines) =>
    set((state) => {
      const group = getActiveGroup(state);
      const tab = group?.tabs.find((item) => item.id === tabId);
      if (!group || !tab) return state;
      const nextLines = sanitizeSelectedLines(selectedLines, tab.content);
      if (nextLines.length === tab.selectedLines.length &&
          nextLines.every((line, index) => line === tab.selectedLines[index])) return state;
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(
          current,
          tabId,
          { selectedLines: nextLines },
          { selectedLines: [...nextLines] },
        ),
      );
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
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(current, tabId, { tabColor: nextColor }, { tabColor: nextColor }),
      );
    }),
  togglePin: (tabId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      const tab = group.tabs.find((item) => item.id === tabId);
      if (!tab) return state;
      return updateGroup(state, group.id, (current) =>
        patchTabAndBookmark(current, tabId, { pinned: !tab.pinned }),
      );
    }),
  closeTab: (tabId) => {
    const state = get();
    const group = getActiveGroup(state);
    const tab = group?.tabs.find((item) => item.id === tabId);
    if (!tab || tab.pinned) return;

    const remainingTabs = group.tabs.filter((item) => item.id !== tabId);
    if (remainingTabs.length === 0) {
      const { tab: replacement, nextTabNumber } = allocateTab(state);
      set({
        ...updateGroup(state, group.id, (current) => ({
          ...current,
          tabs: [replacement],
          activeTabId: replacement.id,
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
        })),
        nextTabNumber,
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
