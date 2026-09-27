import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteTab = {
  id: string;
  title: string;
  content: string;
  savedContent: string;
  urgent: boolean;
  updatedAt: number;
};

export type UnsavedSnapshot = {
  id: string;
  name: string;
  content: string;
  sourceTitle: string;
  capturedAt: number;
};

export type PaneId = "left" | "right";

type NotepadState = {
  tabs: NoteTab[];
  activeTabId: string;
  rightTabIds: string[];
  activeRightTabId: string | null;
  splitRatio: number;
  nextTabNumber: number;
  nextUnsavedNumber: number;
  unsavedSnapshots: UnsavedSnapshot[];
  addTab: (pane?: PaneId) => void;
  selectTab: (tabId: string) => void;
  updateTab: (tabId: string, content: string) => void;
  moveTab: (fromTabId: string, toTabId: string) => void;
  moveTabToPane: (tabId: string, pane: PaneId) => void;
  setSplitRatio: (ratio: number) => void;
  toggleUrgent: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  restoreSnapshot: (snapshotId: string) => void;
  deleteSnapshot: (snapshotId: string) => void;
  clearHistory: () => void;
};

export const MIN_SPLIT_RATIO = 0.2;
export const MAX_SPLIT_RATIO = 0.8;

const createTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: `Untitled ${number}`,
  content: "",
  savedContent: "",
  urgent: false,
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

        if (!tab.content.trim()) return;

        const number = state.nextUnsavedNumber;
        const snapshot: UnsavedSnapshot = {
          id: `unsaved-${number}`,
          name: getTitleFromContent(tab.content, tab.title),
          content: tab.content,
          sourceTitle: tab.title,
          capturedAt: Date.now(),
        };

        set({
          unsavedSnapshots: [snapshot, ...state.unsavedSnapshots],
          nextUnsavedNumber: number + 1,
        });
      };

      return {
        tabs: [createTab(1)],
        activeTabId: "tab-1",
        rightTabIds: [],
        activeRightTabId: null,
        splitRatio: 0.5,
        nextTabNumber: 2,
        nextUnsavedNumber: 1,
        unsavedSnapshots: [],
        addTab: (pane = "left") => {
          const state = get();
          const tabNumber = Math.max(state.nextTabNumber, 2);
          const tab = createTab(tabNumber);
          const toRight = pane === "right" && state.rightTabIds.length > 0;
          set({
            tabs: [...state.tabs, tab],
            rightTabIds: toRight ? [...state.rightTabIds, tab.id] : state.rightTabIds,
            activeRightTabId: toRight ? tab.id : state.activeRightTabId,
            activeTabId: toRight ? state.activeTabId : tab.id,
            nextTabNumber: tabNumber + 1,
          });
        },
        selectTab: (tabId) =>
          set((state) =>
            state.rightTabIds.includes(tabId)
              ? { activeRightTabId: tabId }
              : { activeTabId: tabId },
          ),
        updateTab: (tabId, content) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId
                ? {
                    ...tab,
                    title: getTitleFromContent(content, tab.title),
                    content,
                    updatedAt: Date.now(),
                  }
                : tab,
            ),
          })),
        moveTab: (fromTabId, toTabId) =>
          set((state) => {
            const from = state.tabs.findIndex((tab) => tab.id === fromTabId);
            const to = state.tabs.findIndex((tab) => tab.id === toTabId);
            if (from < 0 || to < 0 || from === to) return state;

            const tabs = [...state.tabs];
            const [moved] = tabs.splice(from, 1);
            tabs.splice(to, 0, moved);
            return { tabs };
          }),
        moveTabToPane: (tabId, pane) =>
          set((state) => {
            if (!state.tabs.some((tab) => tab.id === tabId)) return state;
            const inRight = state.rightTabIds.includes(tabId);

            if (pane === "right") {
              if (inRight) return state;
              // The left pane must always keep at least one tab.
              if (state.tabs.length - state.rightTabIds.length <= 1) return state;

              const rightTabIds = [...state.rightTabIds, tabId];
              const leftTabs = state.tabs.filter((tab) => !rightTabIds.includes(tab.id));
              return {
                rightTabIds,
                activeRightTabId: tabId,
                activeTabId:
                  state.activeTabId === tabId
                    ? leftTabs[leftTabs.length - 1].id
                    : state.activeTabId,
              };
            }

            if (!inRight) return state;
            const rightTabIds = state.rightTabIds.filter((id) => id !== tabId);
            return {
              rightTabIds,
              activeTabId: tabId,
              activeRightTabId:
                rightTabIds.length === 0
                  ? null
                  : state.activeRightTabId === tabId
                    ? rightTabIds[rightTabIds.length - 1]
                    : state.activeRightTabId,
            };
          }),
        setSplitRatio: (ratio) =>
          set({
            splitRatio: Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio)),
          }),
        toggleUrgent: (tabId) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, urgent: !tab.urgent } : tab,
            ),
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
              rightTabIds: [],
              activeRightTabId: null,
              nextTabNumber: 2,
            });
            return;
          }

          const wasRight = currentState.rightTabIds.includes(tabId);
          const rightTabIds = currentState.rightTabIds.filter((id) => id !== tabId);
          const paneIds = currentState.tabs
            .filter((item) => currentState.rightTabIds.includes(item.id) === wasRight)
            .map((item) => item.id);
          const closedIndex = paneIds.indexOf(tabId);
          const nextPaneIds = paneIds.filter((id) => id !== tabId);
          const fallbackId = nextPaneIds[Math.min(closedIndex, nextPaneIds.length - 1)];

          if (wasRight) {
            set({
              tabs: remainingTabs,
              rightTabIds,
              activeRightTabId:
                rightTabIds.length === 0
                  ? null
                  : currentState.activeRightTabId === tabId
                    ? fallbackId
                    : currentState.activeRightTabId,
            });
            return;
          }

          // Closing the last left tab collapses the split and promotes the right pane.
          if (nextPaneIds.length === 0) {
            set({
              tabs: remainingTabs,
              rightTabIds: [],
              activeRightTabId: null,
              activeTabId: currentState.activeRightTabId ?? remainingTabs[0].id,
            });
            return;
          }

          set({
            tabs: remainingTabs,
            rightTabIds,
            activeTabId:
              currentState.activeTabId === tabId ? fallbackId : currentState.activeTabId,
          });
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
            savedContent: snapshot.content,
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
        clearHistory: () => set({ unsavedSnapshots: [] }),
      };
    },
    {
      name: "web-notepad-storage",
      skipHydration: true,
    },
  ),
);
