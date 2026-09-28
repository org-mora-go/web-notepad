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

export type NotepadState = {
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
