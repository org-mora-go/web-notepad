"use client";

import { Bookmark } from "lucide-react";

type Props = {
  lineCount: number;
  bookmarksOpen: boolean;
  onToggleBookmarks: () => void;
};

export function StatusBar({ lineCount, bookmarksOpen, onToggleBookmarks }: Props) {
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
            <Bookmark size={13} strokeWidth={1.8} />
            <span>BOOKMARKS</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
