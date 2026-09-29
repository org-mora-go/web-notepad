"use client";

import { Bookmark, Trash2, X } from "lucide-react";
import type { BookmarkEntry } from "@/src/entity/notepad/store";

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

export function BookmarkPanel({ bookmarks, open, onClose, onOpen, onRemove }: Props) {
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
            <span className="eyebrow">SAVED NOTES</span>
            <h2>Bookmarks</h2>
          </div>
          <button className="panel-close" type="button" onClick={onClose} aria-label="북마크 닫기">
            <X size={19} />
          </button>
        </div>
        <div className="bookmark-list">
          {bookmarks.length === 0 ? (
            <div className="bookmark-empty">
              <Bookmark size={26} strokeWidth={1.4} />
              <p>Empty Bookmarks</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <article className="bookmark-item" key={bookmark.id}>
                <div className="bookmark-item-heading">
                  <strong>{bookmark.title}</strong>
                  <time dateTime={new Date(bookmark.createdAt).toISOString()}>
                    {formatDate(bookmark.createdAt)}
                  </time>
                </div>
                <p>{bookmark.content || "Empty note"}</p>
                <div className="bookmark-actions">
                  <button type="button" onClick={() => onOpen(bookmark.id)}>
                    <Bookmark size={14} />
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
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
