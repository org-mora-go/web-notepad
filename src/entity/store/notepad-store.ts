import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteTab = {
  id: string;
  title: string;
  content: string;
  savedContent: string;
  urgent: boolean;
  pinned: boolean;
  bookmarked: boolean;
  updatedAt: number;
};

export type BookmarkEntry = {
  id: string;
  sourceTabId: string;
  title: string;
  content: string;
  createdAt: number;
};

export type PaneId = "left" | "right";

type NotepadState = {
  tabs: NoteTab[];
  activeTabId: string;
  rightTabIds: string[];
  activeRightTabId: string | null;
  activePane: PaneId;
  splitRatio: number;
  nextTabNumber: number;
  bookmarks: BookmarkEntry[];
  addTab: (pane?: PaneId) => void;
  selectTab: (tabId: string) => void;
  updateTab: (tabId: string, content: string) => void;
  moveTab: (fromTabId: string, toTabId: string) => void;
  moveTabToPane: (tabId: string, pane: PaneId) => void;
  setActivePane: (pane: PaneId) => void;
  setSplitRatio: (ratio: number) => void;
  toggleUrgent: (tabId: string) => void;
  togglePin: (tabId: string) => void;
  toggleBookmark: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  openBookmark: (bookmarkId: string) => void;
  removeBookmark: (bookmarkId: string) => void;
};

export const MIN_SPLIT_RATIO = 0.2;
export const MAX_SPLIT_RATIO = 0.8;

const createTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: `Untitled ${number}`,
  content: "",
  savedContent: "",
  urgent: false,
  pinned: false,
  bookmarked: false,
  updatedAt: 0,
});

const getNextTabNumber = (tabs: NoteTab[], nextTabNumber: number) => {
  const usedIds = new Set(tabs.map((tab) => tab.id));
  let number = Math.max(nextTabNumber, 2);
  while (usedIds.has(`tab-${number}`)) number += 1;
  return number;
};

const sortPinnedFirst = (tabs: NoteTab[]) =>
  tabs
    .map((tab, index) => ({ tab, index }))
    .sort(
      (a, b) => Number(Boolean(b.tab.pinned)) - Number(Boolean(a.tab.pinned)) || a.index - b.index,
    )
    .map(({ tab }) => tab);

const getTitleFromContent = (content: unknown, fallback: string) => {
  const text = typeof content === "string" ? content : "";
  if (!text.trim()) {
    return "Untitled";
  }

  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine?.slice(0, 28) || fallback;
};

export const useNotepadStore = create<NotepadState>()(
  persist(
    (set, get) => {
      return {
        tabs: [createTab(1)],
        activeTabId: "tab-1",
        rightTabIds: [],
        activeRightTabId: null,
        activePane: "left",
        splitRatio: 0.5,
        nextTabNumber: 2,
        bookmarks: [],
        addTab: (pane = "left") => {
          const state = get();
          const tabNumber = getNextTabNumber(state.tabs, state.nextTabNumber);
          const tab = createTab(tabNumber);
          const toRight = pane === "right" && state.rightTabIds.length > 0;
          set({
            tabs: [...state.tabs, tab],
            rightTabIds: toRight ? [...state.rightTabIds, tab.id] : state.rightTabIds,
            activeRightTabId: toRight ? tab.id : state.activeRightTabId,
            activeTabId: toRight ? state.activeTabId : tab.id,
            activePane: toRight ? "right" : "left",
            nextTabNumber: tabNumber + 1,
          });
        },
        selectTab: (tabId) =>
          set((state) =>
            state.rightTabIds.includes(tabId)
              ? { activeRightTabId: tabId, activePane: "right" }
              : { activeTabId: tabId, activePane: "left" },
          ),
        updateTab: (tabId, content) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId
                ? {
                    ...tab,
                    title: getTitleFromContent(content, tab.title),
                    content: typeof content === "string" ? content : "",
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
            return { tabs: sortPinnedFirst(tabs) };
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
                activePane: "right",
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
              activePane: "left",
              activeRightTabId:
                rightTabIds.length === 0
                  ? null
                  : state.activeRightTabId === tabId
                    ? rightTabIds[rightTabIds.length - 1]
                    : state.activeRightTabId,
            };
          }),
        setActivePane: (pane) =>
          set((state) => ({
            activePane: pane === "right" && state.rightTabIds.length === 0 ? "left" : pane,
          })),
        setSplitRatio: (ratio) =>          set({
            splitRatio: Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio)),
          }),
        toggleUrgent: (tabId) =>
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, urgent: !tab.urgent } : tab,
            ),
          })),
        togglePin: (tabId) =>
          set((state) => ({
            tabs: sortPinnedFirst(
              state.tabs.map((tab) =>
                tab.id === tabId ? { ...tab, pinned: !tab.pinned } : tab,
              ),
            ),
          })),
        toggleBookmark: (tabId) =>
          set((state) => {
            const tab = state.tabs.find((item) => item.id === tabId);
            if (!tab) return state;
            const existing = state.bookmarks.find((item) => item.sourceTabId === tabId);
            if (existing) {
              return {
                tabs: state.tabs.map((item) =>
                  item.id === tabId ? { ...item, bookmarked: false } : item,
                ),
                bookmarks: state.bookmarks.filter((item) => item.id !== existing.id),
              };
            }

            const now = Date.now();
            return {
              tabs: state.tabs.map((item) =>
                item.id === tabId ? { ...item, bookmarked: true } : item,
              ),
              bookmarks: [
                {
                  id: `bookmark-${tabId}`,
                  sourceTabId: tabId,
                  title: getTitleFromContent(tab.content, tab.title),
                  content: tab.content,
                  createdAt: now,
                },
                ...state.bookmarks,
              ],
            };
          }),
        closeTab: (tabId) => {
          const state = get();
          const tab = state.tabs.find((item) => item.id === tabId);
          if (!tab || tab.pinned) return;

          const currentState = get();
          const remainingTabs = currentState.tabs.filter((item) => item.id !== tabId);

          if (remainingTabs.length === 0) {
            const replacement = createTab(1);
            set({
              tabs: [replacement],
              activeTabId: replacement.id,
              rightTabIds: [],
              activeRightTabId: null,
              activePane: "left",
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
              activePane: rightTabIds.length === 0 ? "left" : "right",
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
              activePane: "left",
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
        openBookmark: (bookmarkId) => {
          const state = get();
          const bookmark = state.bookmarks.find((item) => item.id === bookmarkId);
          if (!bookmark) return;

          const tabNumber = getNextTabNumber(state.tabs, state.nextTabNumber);
          const tab = createTab(tabNumber);
          const restoredTab = {
            ...tab,
            title: bookmark.title,
            content: bookmark.content,
            savedContent: bookmark.content,
            updatedAt: bookmark.createdAt,
          };
          set({
            tabs: [...state.tabs, restoredTab],
            activeTabId: restoredTab.id,
            nextTabNumber: tabNumber + 1,
            activePane: "left",
          });
        },
        removeBookmark: (bookmarkId) =>
          set((state) => ({
            bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
            tabs: state.tabs.map((tab) =>
              state.bookmarks.some(
                (bookmark) => bookmark.id === bookmarkId && bookmark.sourceTabId === tab.id,
              )
                ? { ...tab, bookmarked: false }
                : tab,
            ),
          })),
      };
    },
    {
      name: "web-notepad-storage",
      skipHydration: true,
      merge: (persistedState, currentState) => {
        const persisted = {
          ...(persistedState as Partial<NotepadState> & {
            unsavedSnapshots?: unknown;
            nextUnsavedNumber?: unknown;
          }),
        };
        delete persisted.unsavedSnapshots;
        delete persisted.nextUnsavedNumber;
        const tabs = (persisted.tabs ?? currentState.tabs).map((tab) => ({
          ...tab,
          title: typeof tab.title === "string" ? tab.title : "Untitled",
          content: typeof tab.content === "string" ? tab.content : "",
          savedContent: typeof tab.savedContent === "string" ? tab.savedContent : "",
          urgent: Boolean(tab.urgent),
          pinned: Boolean(tab.pinned),
          bookmarked: Boolean(tab.bookmarked),
        }));
        const bookmarks = Array.isArray(persisted.bookmarks)
          ? persisted.bookmarks
              .filter((bookmark) => bookmark && typeof bookmark.id === "string")
              .map((bookmark) => ({
                ...bookmark,
                sourceTabId:
                  typeof bookmark.sourceTabId === "string" ? bookmark.sourceTabId : "",
                title: typeof bookmark.title === "string" ? bookmark.title : "Untitled",
                content: typeof bookmark.content === "string" ? bookmark.content : "",
                createdAt:
                  typeof bookmark.createdAt === "number" && Number.isFinite(bookmark.createdAt)
                    ? bookmark.createdAt
                    : Date.now(),
              }))
          : currentState.bookmarks;

        return {
          ...currentState,
          ...persisted,
          tabs,
          bookmarks,
        };
      },
    },
  ),
);
