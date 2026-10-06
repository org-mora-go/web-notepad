"use client";

import { Bookmark as BookmarkIcon, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { BookmarkEntry } from "@/src/entity/notepad";
import { matchesSearchQuery, SearchField } from "@/src/feature";

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

type Props = {
  bookmarks: BookmarkEntry[];
  open: boolean;
  onClose: () => void;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

type BookmarkItemProps = {
  bookmark: BookmarkEntry;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

function BookmarkItem({ bookmark, onOpen, onRemove }: BookmarkItemProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const observer = new ResizeObserver(() => {
      if (!expanded) {
        setCanExpand(contentElement.scrollHeight > contentElement.clientHeight);
      }
    });
    observer.observe(contentElement);

    return () => observer.disconnect();
  }, [bookmark.content, expanded]);

  return (
    <article className="bookmark-item">
      <div className="bookmark-item-heading">
        <strong>{bookmark.title}</strong>
        <time dateTime={new Date(bookmark.createdAt).toISOString()}>
          {formatDate(bookmark.createdAt)}
        </time>
      </div>
      <p
        ref={contentRef}
        className={`bookmark-content ${expanded ? "is-expanded" : ""}`}
      >
        {bookmark.content || "Empty note"}
      </p>
      {(canExpand || expanded) && (
        <button
          className="bookmark-content-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "간소화" : "더보기"}
        </button>
      )}
      <div className="bookmark-actions">
        <button type="button" onClick={() => onOpen(bookmark.id)}>
          <BookmarkIcon size={14} />
          열기
        </button>
        <button
          className="remove-bookmark"
          type="button"
          onClick={() => onRemove(bookmark.id)}
          aria-label={`${bookmark.title} 북마크 제거`}
          title="북마크 제거"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}

export function Bookmark({
  bookmarks,
  open,
  onClose,
  onOpen,
  onRemove,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredBookmarks = bookmarks.filter((bookmark) =>
    matchesSearchQuery(searchQuery, bookmark.title, bookmark.content),
  );

  return (
    <div className="bookmark-panel">
      <div
        className={`bookmark-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="bookmarks-panel"
        className={`bookmark-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="bookmark-header">
          <div className="bookmark-header-main">
            <h2>Bookmarks</h2>
          </div>
          <button
            className="panel-close"
            type="button"
            onClick={onClose}
            aria-label="북마크 닫기"
          >
            <X size={12} />
          </button>
        </div>
        <SearchField
          value={searchQuery}
          ariaLabel="북마크 검색"
          placeholder="Search bookmarks"
          onChange={setSearchQuery}
        />
        <div className="bookmark-list">
          {bookmarks.length === 0 ? (
            <div className="bookmark-empty">
              <BookmarkIcon size={26} strokeWidth={1.4} />
              <p>Empty Bookmarks</p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="search-empty-state">
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onOpen={onOpen}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
