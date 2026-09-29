import type { StateCreator } from "zustand";

import { MAX_SPLIT_RATIO, MIN_SPLIT_RATIO } from "../constant";
import type { NotepadState, PaneId } from "../type";

type PaneActions = Pick<NotepadState, "moveTabToPane" | "setActivePane" | "setSplitRatio">;

export const createPaneActions: StateCreator<NotepadState, [], [], PaneActions> = (set) => ({
  moveTabToPane: (tabId, pane) =>
    set((state) => {
      if (!state.tabs.some((tab) => tab.id === tabId)) return state;
      const inRight = state.rightTabIds.includes(tabId);

      if (pane === "right") {
        if (inRight) return state;

        const rightTabIds = [...state.rightTabIds, tabId];
        const leftTabs = state.tabs.filter((tab) => !rightTabIds.includes(tab.id));
        if (leftTabs.length === 0) {
          return {
            rightTabIds: [],
            activeRightTabId: null,
            activeTabId: tabId,
            activePane: "left" as const,
          };
        }

        return {
          rightTabIds,
          activeRightTabId: tabId,
          activePane: "right",
          activeTabId:
            state.activeTabId === tabId
              ? leftTabs[leftTabs.length - 1]?.id ?? ""
              : state.activeTabId,
        };
      }

      if (!inRight) return state;
      const rightTabIds = state.rightTabIds.filter((id) => id !== tabId);
      return {
        rightTabIds,
        activeTabId: tabId,
        activePane: "left",
        activeRightTabId:
          rightTabIds.length === 0
            ? null
            : state.activeRightTabId === tabId
              ? rightTabIds[rightTabIds.length - 1]
              : state.activeRightTabId,
      };
    }),
  setActivePane: (pane: PaneId) =>
    set((state) => ({
      activePane: pane === "right" && state.rightTabIds.length === 0 ? "left" : pane,
    })),
  setSplitRatio: (ratio) =>
    set({ splitRatio: Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio)) }),
});
