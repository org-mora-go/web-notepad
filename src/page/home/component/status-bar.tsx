"use client";

import { Bookmark, Keyboard, Layers } from "lucide-react";

type Props = {
  bookmarkCount: number;
  shortcutsOpen: boolean;
  bookmarksOpen: boolean;
  groupCount: number;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleShortcuts: () => void;
  onToggleGroups: () => void;
};

export function StatusBar({
  bookmarkCount,
  shortcutsOpen,
  bookmarksOpen,
  groupCount,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleShortcuts,
  onToggleGroups,
}: Props) {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="save-state">
          <span className="status-light" />
        </div>
        <button
          className={`status-command shortcut-command ${shortcutsOpen ? "is-active" : ""}`}
          type="button"
          onClick={onToggleShortcuts}
          aria-expanded={shortcutsOpen}
          aria-controls="shortcuts-panel"
          aria-label="단축키 안내"
        >
          <span className="status-separator" aria-hidden="true">
            |
          </span>
          <Keyboard size={16} strokeWidth={1.8} />
          <span>SHORTCUT</span>
        </button>
      </div>
      <div className="status-meta">
        <div className="status-actions">
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
          </button>
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
          >
            <span className="status-separator" aria-hidden="true">
              |
            </span>
            <Layers size={16} strokeWidth={1.8} />
            <span className="group-status-name">{activeGroupName}</span>
            <span className="status-count">({groupCount})</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
