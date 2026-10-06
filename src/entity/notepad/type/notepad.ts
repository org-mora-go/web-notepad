export type TabColor = "gray" | "red" | "green";

export type NoteTab = {
  id: string;
  title: string;
  content: string;
  savedContent: string;
  selectedLines: number[];
  tabColor: TabColor;
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

export type GroupEntry = {
  id: string;
  name: string;
  createdAt: number;
  tabs: NoteTab[];
  bookmarks: BookmarkEntry[];
  activeTabId: string;
  rightTabIds: string[];
  activeRightTabId: string | null;
  activePane: PaneId;
  splitRatio: number;
};

export type PaneId = "left" | "right";

export type NotepadState = {
  nextTabNumber: number;
  groups: GroupEntry[];
  activeGroupId: string;
  addTab: (pane?: PaneId) => void;
  selectTab: (tabId: string) => void;
  updateTab: (tabId: string, content: string) => void;
  setTabSelectedLines: (tabId: string, selectedLines: number[]) => void;
  moveTab: (fromTabId: string, toTabId: string) => void;
  moveTabToPane: (tabId: string, pane: PaneId) => void;
  setActivePane: (pane: PaneId) => void;
  setSplitRatio: (ratio: number) => void;
  cycleTabColor: (tabId: string) => void;
  togglePin: (tabId: string) => void;
  toggleBookmark: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  openBookmark: (bookmarkId: string) => void;
  removeBookmark: (bookmarkId: string) => void;
  createGroup: (name: string) => void;
  removeGroup: (groupId: string) => void;
  selectGroup: (groupId: string) => void;
};
