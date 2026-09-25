import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteTab = {
  id: string;
  title: string;
  content: string;
  savedContent: string;
  updatedAt: number;
};

export type UnsavedSnapshot = {
  id: string;
  name: string;
  content: string;
  sourceTitle: string;
  capturedAt: number;
};

type NotepadState = {
  tabs: NoteTab[];
  activeTabId: string;
  nextTabNumber: number;
  nextUnsavedNumber: number;
  unsavedSnapshots: UnsavedSnapshot[];
  lastSnapshotByTab: Record<string, string>;
  addTab: () => void;
  selectTab: (tabId: string) => void;
  updateTab: (tabId: string, content: string) => void;
  saveTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  snapshotTab: (tabId: string) => void;
  restoreSnapshot: (snapshotId: string) => void;
  deleteSnapshot: (snapshotId: string) => void;
};

const createTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: `Untitled ${number}`,
  content: "",
  savedContent: "",
  updatedAt: 0,
});

const getTitleFromContent = (content: string, fallback: string) => {
  if (!content.trim()) {
    return "Untitled";
  }

  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine?.slice(0, 28) || fallback;
};

export const useNotepadStore = create<NotepadState>()(
  persist(
    (set, get) => {
      const addSnapshot = (tab: NoteTab) => {
        const state = get();

        if (!tab.content.trim() || tab.content === tab.savedContent) return;
        if (state.lastSnapshotByTab[tab.id] === tab.content) return;

        const number = state.nextUnsavedNumber;
        const snapshot: UnsavedSnapshot = {
          id: `unsaved-${number}`,
          name: `unsaved-${number}`,
          content: tab.content,
          sourceTitle: tab.title,
          capturedAt: Date.now(),
        };

        set({
          unsavedSnapshots: [snapshot, ...state.unsavedSnapshots],
          nextUnsavedNumber: number + 1,
          lastSnapshotByTab: {
            ...state.lastSnapshotByTab,
            [tab.id]: tab.content,
          },
        });
      };

      return {
        tabs: [createTab(1)],
        activeTabId: "tab-1",
        nextTabNumber: 2,
        nextUnsavedNumber: 1,
        unsavedSnapshots: [],
        lastSnapshotByTab: {},
        addTab: () => {
          const state = get();
          const tab = createTab(state.nextTabNumber);
          set({
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
            nextTabNumber: state.nextTabNumber + 1,
          });
        },
        selectTab: (tabId) => set({ activeTabId: tabId }),
        updateTab: (tabId, content) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, content, updatedAt: Date.now() } : tab,
            ),
          })),
        saveTab: (tabId) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId
                ? {
                    ...tab,
                    title: getTitleFromContent(tab.content, tab.title),
                    savedContent: tab.content,
                    updatedAt: Date.now(),
                  }
                : tab,
            ),
            lastSnapshotByTab: {
              ...state.lastSnapshotByTab,
              [tabId]: state.tabs.find((tab) => tab.id === tabId)?.content ?? "",
            },
          })),
        closeTab: (tabId) => {
          const state = get();
          const tab = state.tabs.find((item) => item.id === tabId);
          if (!tab) return;

          addSnapshot(tab);
          const currentState = get();
          const remainingTabs = currentState.tabs.filter((item) => item.id !== tabId);

          if (remainingTabs.length === 0) {
            const replacement = createTab(1);
            set({
              tabs: [replacement],
              activeTabId: replacement.id,
              nextTabNumber: 2,
            });
            return;
          }

          const closedIndex = currentState.tabs.findIndex((item) => item.id === tabId);
          const nextActive =
            currentState.activeTabId === tabId
              ? remainingTabs[Math.min(closedIndex, remainingTabs.length - 1)].id
              : currentState.activeTabId;
          set({ tabs: remainingTabs, activeTabId: nextActive });
        },
        snapshotTab: (tabId) => {
          const tab = get().tabs.find((item) => item.id === tabId);
          if (tab) addSnapshot(tab);
        },
        restoreSnapshot: (snapshotId) => {
          const state = get();
          const snapshot = state.unsavedSnapshots.find((item) => item.id === snapshotId);
          if (!snapshot) return;

          const tab = createTab(state.nextTabNumber);
          const restoredTab = {
            ...tab,
            title: snapshot.name,
            content: snapshot.content,
            updatedAt: Date.now(),
          };
          set({
            tabs: [...state.tabs, restoredTab],
            activeTabId: restoredTab.id,
            nextTabNumber: state.nextTabNumber + 1,
          });
        },
        deleteSnapshot: (snapshotId) =>
          set((state) => ({
            unsavedSnapshots: state.unsavedSnapshots.filter(
              (snapshot) => snapshot.id !== snapshotId,
            ),
          })),
      };
    },
    {
      name: "web-notepad-storage",
      skipHydration: true,
    },
  ),
);