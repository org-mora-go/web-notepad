import type { StateCreator } from "zustand";

import { MAX_SPLIT_RATIO, MIN_SPLIT_RATIO } from "../constant";
import type { NotepadState, PaneId } from "../type";
import { getActiveGroup, updateGroup } from "./workspace";

type PaneActions = Pick<
  NotepadState,
  "moveTabToPane" | "setActivePane" | "setSplitRatio"
>;

export const createPaneActions: StateCreator<
  NotepadState,
  [],
  [],
  PaneActions
> = (set) => ({
  moveTabToPane: (tabId, pane) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group || !group.tabs.some((tab) => tab.id === tabId)) return state;
      const inRight = group.rightTabIds.includes(tabId);

      if (pane === "right") {
        if (inRight) return state;

        const rightTabIds = [...group.rightTabIds, tabId];
        const leftTabs = group.tabs.filter(
          (tab) => !rightTabIds.includes(tab.id),
        );
        if (leftTabs.length === 0) {
          return updateGroup(state, group.id, (current) => ({
            ...current,
            rightTabIds: [],
            activeRightTabId: null,
            activeTabId: tabId,
            activePane: "left",
          }));
        }

        return updateGroup(state, group.id, (current) => ({
          ...current,
          rightTabIds,
          activeRightTabId: tabId,
          activePane: "right",
          activeTabId:
            current.activeTabId === tabId
              ? (leftTabs[leftTabs.length - 1]?.id ?? "")
              : current.activeTabId,
        }));
      }

      if (!inRight) return state;
      const rightTabIds = group.rightTabIds.filter((id) => id !== tabId);
      return updateGroup(state, group.id, (current) => ({
        ...current,
        rightTabIds,
        activeTabId: tabId,
        activePane: "left",
        activeRightTabId:
          rightTabIds.length === 0
            ? null
            : current.activeRightTabId === tabId
              ? rightTabIds[rightTabIds.length - 1]
              : current.activeRightTabId,
      }));
    }),
  setActivePane: (pane: PaneId) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        activePane:
          pane === "right" && current.rightTabIds.length === 0 ? "left" : pane,
      }));
    }),
  setSplitRatio: (ratio) =>
    set((state) => {
      const group = getActiveGroup(state);
      if (!group) return state;
      return updateGroup(state, group.id, (current) => ({
        ...current,
        splitRatio: Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio)),
      }));
    }),
});
