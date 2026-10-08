"use client";

import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";

import type { BookmarkEntry } from "@/src/entity/notepad";
import { ExpandableContent } from "@/src/entity/ui";
import { formatDate } from "@/src/entity/util";
import { SearchHighlight } from "@/src/feature/search-field/component";

type Props = {
  bookmark: BookmarkEntry;
  searchQuery: string;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

export function BookmarkItem({ bookmark, searchQuery, onOpen, onRemove }: Props) {
  return (
    <article className="bookmark-item">
      <div className="bookmark-item-heading">
        <strong>
          <SearchHighlight text={bookmark.title} query={searchQuery} />
        </strong>
        <time dateTime={new Date(bookmark.createdAt).toISOString()}>
          {formatDate(bookmark.createdAt)}
        </time>
      </div>
      <ExpandableContent
        content={
          <SearchHighlight
            text={bookmark.content || "Empty note"}
            query={searchQuery}
          />
        }
      />
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
