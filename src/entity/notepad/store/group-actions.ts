import type { StateCreator } from "zustand";

import { UNGROUPED_GROUP_ID } from "../constant";
import type { NotepadState } from "../type";
import { createNoteTab, getNextTabNumber } from "../util";
import { getAllTabs, getReservedTabIds } from "./workspace";

type GroupActions = Pick<
  NotepadState,
  "createGroup" | "removeGroup" | "selectGroup"
>;

export const createGroupActions: StateCreator<
  NotepadState,
  [],
  [],
  GroupActions
> = (set, get) => ({
  createGroup: (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const state = get();
    const number = getNextTabNumber(
      getAllTabs(state),
      getReservedTabIds(state),
      state.nextTabNumber,
    );
    const tab = createNoteTab(number);
    const id = `group-${crypto.randomUUID()}`;
    set({
      groups: [
        ...state.groups,
        {
          id,
          name: trimmedName,
          createdAt: Date.now(),
          tabs: [tab],
          bookmarks: [],
          activeTabId: tab.id,
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
          splitRatio: 0.5,
        },
      ],
      activeGroupId: id,
      nextTabNumber: number + 1,
    });
  },
  removeGroup: (groupId) =>
    set((state) => {
      if (groupId === UNGROUPED_GROUP_ID) return state;
      const removedGroup = state.groups.find((group) => group.id === groupId);
      const ungrouped = state.groups.find(
        (group) => group.id === UNGROUPED_GROUP_ID,
      );
      if (!removedGroup || !ungrouped) return state;

      const nextUngrouped = {
        ...ungrouped,
        tabs: [...ungrouped.tabs, ...removedGroup.tabs],
        bookmarks: [...ungrouped.bookmarks, ...removedGroup.bookmarks],
        activeTabId:
          state.activeGroupId === groupId
            ? removedGroup.activeTabId
            : ungrouped.activeTabId,
        activePane:
          state.activeGroupId === groupId
            ? ("left" as const)
            : ungrouped.activePane,
      };
      return {
        groups: state.groups
          .filter((group) => group.id !== groupId)
          .map((group) =>
            group.id === UNGROUPED_GROUP_ID ? nextUngrouped : group,
          ),
        activeGroupId:
          state.activeGroupId === groupId
            ? UNGROUPED_GROUP_ID
            : state.activeGroupId,
      };
    }),
  selectGroup: (groupId) =>
    set((state) =>
      state.groups.some((group) => group.id === groupId)
        ? { activeGroupId: groupId }
        : state,
    ),
});
