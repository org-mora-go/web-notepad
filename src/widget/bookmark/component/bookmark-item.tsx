"use client";

import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { BookmarkEntry } from "@/src/entity/notepad";

type Props = {
  bookmark: BookmarkEntry;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

export function BookmarkItem({ bookmark, onOpen, onRemove }: Props) {
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
