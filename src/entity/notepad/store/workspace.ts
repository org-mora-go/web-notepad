import type { GroupEntry, NotepadState } from "../type";

export const getActiveGroup = (state: NotepadState) =>
  state.groups.find((group) => group.id === state.activeGroupId) ?? state.groups[0];

export const updateGroup = (
  state: NotepadState,
  groupId: string,
  update: (group: GroupEntry) => GroupEntry,
) => ({
  groups: state.groups.map((group) =>
    group.id === groupId ? update(group) : group,
  ),
});

export const getAllTabs = (state: NotepadState) =>
  state.groups.flatMap((group) => group.tabs);

export const getReservedTabIds = (state: NotepadState) =>
  state.groups.flatMap((group) =>
    group.bookmarks.map((bookmark) => bookmark.sourceTabId),
  );