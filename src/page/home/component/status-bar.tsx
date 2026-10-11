"use client";

import { Bookmark, Ghost, Keyboard, Layers, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  closedOpen: boolean;
  closedCount: number;
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
  closedCount,
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollFades, setScrollFades] = useState({ left: false, right: false });

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const updateScrollFades = () => {
      const hasOverflow = scrollArea.scrollWidth > scrollArea.clientWidth + 1;
      const nextFades = {
        left: hasOverflow && scrollArea.scrollLeft > 1,
        right:
          hasOverflow &&
          scrollArea.scrollLeft + scrollArea.clientWidth < scrollArea.scrollWidth - 1,
      };
      setScrollFades((current) =>
        current.left === nextFades.left && current.right === nextFades.right
          ? current
          : nextFades,
      );
    };

    updateScrollFades();
    const observer = new ResizeObserver(updateScrollFades);
    observer.observe(scrollArea);
    if (scrollArea.firstElementChild instanceof HTMLElement) {
      observer.observe(scrollArea.firstElementChild);
    }
    scrollArea.addEventListener("scroll", updateScrollFades, { passive: true });

    return () => {
      observer.disconnect();
      scrollArea.removeEventListener("scroll", updateScrollFades);
    };
  }, []);

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
        <div className="status-controls">
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
          <div
            ref={scrollAreaRef}
            className={`status-scroll-area ${scrollFades.left ? "has-left-fog" : ""} ${scrollFades.right ? "has-right-fog" : ""}`}
          >
            <div className="status-actions">
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
                {closedCount > 0 && (
                  <span className="status-count">({closedCount})</span>
                )}
                <span className="status-separator" aria-hidden="true">
                  |
                </span>
              </button>
              <button
                className={`status-command bookmark-command ${bookmarksOpen ? "is-active" : ""}`}
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
            </div>
          </div>
          <button
            className={`status-command group-status-command ${groupsOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleGroups}
            aria-expanded={groupsOpen}
            aria-controls="groups-panel"
          >
            <Layers size={16} strokeWidth={1.8} />
            <span className="group-status-label">GROUP</span>
            <span className="group-status-name">{activeGroupName}</span>
            <span className="status-count">({groupCount})</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
