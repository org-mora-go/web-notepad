"use client";

import { Bookmark, Ghost, Keyboard, Layers, Search } from "lucide-react";

type Props = {
  closedOpen: boolean;
  bookmarkCount: number;
  shortcutsOpen: boolean;
  bookmarksOpen: boolean;
  groupCount: number;
  activeGroupName: string;
  groupsOpen: boolean;
  globalSearchOpen: boolean;
  onToggleClosed: () => void;
  onToggleBookmarks: () => void;
  onToggleShortcuts: () => void;
  onToggleGroups: () => void;
  onToggleGlobalSearch: () => void;
};

export function StatusBar({
  closedOpen,
  bookmarkCount,
  shortcutsOpen,
  bookmarksOpen,
  groupCount,
  activeGroupName,
  groupsOpen,
  globalSearchOpen,
  onToggleClosed,
  onToggleBookmarks,
  onToggleShortcuts,
  onToggleGroups,
  onToggleGlobalSearch,
}: Props) {
  return (
    <footer className="status-bar">
      <div className="status-meta">
        <button
          className={`status-command shortcut-command ${shortcutsOpen ? "is-active" : ""}`}
          type="button"
          onClick={onToggleShortcuts}
          aria-expanded={shortcutsOpen}
          aria-controls="shortcuts-panel"
          aria-label="단축키 안내"
        >
          <Keyboard size={16} strokeWidth={1.8} />
          <span>SHORTCUT</span>
        </button>
        <div className="status-actions">
          <button
            className={`status-command global-search-command ${globalSearchOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGlobalSearch}
            aria-expanded={globalSearchOpen}
            aria-controls="global-search-panel"
            aria-label="전체 검색"
          >
            <Search size={16} strokeWidth={1.8} />
            <span className="global-search-label">SEARCH</span>
            <span className="status-separator" aria-hidden="true">
              |
            </span>
          </button>
          <button
            className={`status-command closed-command ${closedOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleClosed}
            aria-expanded={closedOpen}
            aria-controls="closed-panel"
            aria-label="닫은 탭"
          >
            <Ghost size={16} strokeWidth={1.8} />
            <span className="status-label closed-status-label">CLOSED</span>
            <span className="status-separator" aria-hidden="true">
              |
            </span>
          </button>
          <button
            className={`status-command ${bookmarksOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleBookmarks}
            aria-expanded={bookmarksOpen}
            aria-controls="bookmarks-panel"
          >
            <Bookmark size={16} strokeWidth={1.8} />
            <span className="status-label">BOOKMARK</span>
            {bookmarkCount > 0 && (
              <span className="status-count">({bookmarkCount})</span>
            )}
            <span className="status-separator" aria-hidden="true">
              |
            </span>
          </button>
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
          >
            <Layers size={16} strokeWidth={1.8} />
            <span className="group-status-name">{activeGroupName}</span>
            <span className="status-count">({groupCount})</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
