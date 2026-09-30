"use client";

import { Bookmark, Layers } from "lucide-react";

type Props = {
  lineCount: number;
  bookmarkCount: number;
  bookmarksOpen: boolean;
  groupCount: number;
  activeGroupName: string;
  groupsOpen: boolean;
  onToggleBookmarks: () => void;
  onToggleGroups: () => void;
};

export function StatusBar({
  lineCount,
  bookmarkCount,
  bookmarksOpen,
  groupCount,
  activeGroupName,
  groupsOpen,
  onToggleBookmarks,
  onToggleGroups,
}: Props) {
  return (
    <footer className="status-bar">
      <div className="save-state">
        <span className="status-light" />
        <span className="creator-credit">DEVELOPED BY HYUN-WOO YOO</span>
      </div>
      <div className="status-meta">
        <span className="status-lines">{lineCount} LINES</span>
        <div className="status-actions">
          <button
            className={`status-command ${bookmarksOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleBookmarks}
            aria-expanded={bookmarksOpen}
            aria-controls="bookmarks-panel"
          >
            <Bookmark size={16} strokeWidth={1.8} />
            <span>
              BOOKMARK{bookmarkCount > 0 ? ` (${bookmarkCount})` : ""}
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
            <span>
              {activeGroupName} ({groupCount})
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
