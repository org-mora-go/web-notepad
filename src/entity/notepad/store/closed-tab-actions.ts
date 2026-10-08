import type { StateCreator } from "zustand";

import { UNGROUPED_GROUP_ID } from "../constant";
import type { NotepadState } from "../type";
import { allocateTab, updateGroup } from "./workspace";

type ClosedTabActions = Pick<NotepadState, "restoreClosedTab" | "removeClosedTab">;

export const createClosedTabActions: StateCreator<
  NotepadState,
  [],
  [],
  ClosedTabActions
> = (set, get) => ({
  restoreClosedTab: (entryId) => {
    const state = get();
    const entry = state.closedTabs.find((item) => item.id === entryId);
    if (!entry) return;
    // A tab closed from a since-deleted group goes back to Ungrouped.
    const target =
      state.groups.find((group) => group.id === entry.groupId) ??
      state.groups.find((group) => group.id === UNGROUPED_GROUP_ID);
    if (!target) return;

    // Reissue the ID when another tab has taken it since the tab was closed.
    const idTaken = state.groups.some((group) =>
      group.tabs.some((tab) => tab.id === entry.tab.id),
    );
    const allocated = idTaken ? allocateTab(state) : null;
    const tabId = allocated?.tab.id ?? entry.tab.id;
    const tab = {
      ...entry.tab,
      id: tabId,
      bookmarked: target.bookmarks.some((bookmark) => bookmark.sourceTabId === tabId),
    };

    set({
      ...updateGroup(state, target.id, (current) => ({
        ...current,
        tabs: [...current.tabs, tab],
        activeTabId: tabId,
        activePane: "left",
      })),
      activeGroupId: target.id,
      nextTabNumber: allocated?.nextTabNumber ?? state.nextTabNumber,
      closedTabs: state.closedTabs.filter((item) => item.id !== entryId),
    });
  },
  removeClosedTab: (entryId) =>
    set((state) => ({
      closedTabs: state.closedTabs.filter((item) => item.id !== entryId),
    })),
});
