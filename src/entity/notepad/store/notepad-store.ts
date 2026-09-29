import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotepadState } from "../type";
import { createNoteTab, normalizePersistedState } from "../util";
import { createBookmarkActions } from "./bookmark-actions";
import { createPaneActions } from "./pane-actions";
import { createTabActions } from "./tab-actions";

export { MAX_SPLIT_RATIO, MIN_SPLIT_RATIO } from "../constant";

export const useNotepadStore = create<NotepadState>()(
  persist(
    (set, get, store) => ({
      ...createTabActions(set, get, store),
      ...createPaneActions(set, get, store),
      ...createBookmarkActions(set, get, store),
      tabs: [createNoteTab(1)],
      activeTabId: "tab-1",
      rightTabIds: [],
      activeRightTabId: null,
      activePane: "left",
      splitRatio: 0.5,
      nextTabNumber: 2,
      bookmarks: [],
    }),
    {
      name: "web-notepad-storage",
      skipHydration: true,
      merge: normalizePersistedState,
    },
  ),
);
