import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UNGROUPED_GROUP_ID } from "../constant";
import type { NotepadState } from "../type";
import { createNoteTab, normalizePersistedState } from "../util";
import { createBookmarkActions } from "./bookmark-actions";
import { createGroupActions } from "./group-actions";
import { createPaneActions } from "./pane-actions";
import { createTabActions } from "./tab-actions";
import { createGroupEntry } from "./workspace";

export {
  MAX_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  UNGROUPED_GROUP_ID,
} from "../constant";

export const useNotepadStore = create<NotepadState>()(
  persist(
    (set, get, store) => ({
      ...createTabActions(set, get, store),
      ...createPaneActions(set, get, store),
      ...createBookmarkActions(set, get, store),
      ...createGroupActions(set, get, store),
      nextTabNumber: 2,
      activeGroupId: UNGROUPED_GROUP_ID,
      groups: [createGroupEntry(UNGROUPED_GROUP_ID, "Ungrouped", 0, createNoteTab(1))],
    }),
    {
      name: "web-notepad-storage",
      skipHydration: true,
      merge: normalizePersistedState,
    },
  ),
);
