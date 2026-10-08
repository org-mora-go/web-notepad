"use client";

import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";

import { useExpandableContent } from "@/src/entity/hook";
import type { BookmarkEntry } from "@/src/entity/notepad";
import { formatDate } from "@/src/entity/util";

type Props = {
  bookmark: BookmarkEntry;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

export function BookmarkItem({ bookmark, onOpen, onRemove }: Props) {
  const { contentRef, expanded, canExpand, toggleExpanded } =
    useExpandableContent(bookmark.content);

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
          onClick={toggleExpanded}
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
