"use client";

import { Bookmark as BookmarkIcon, X } from "lucide-react";
import { useState } from "react";

import type { BookmarkEntry } from "@/src/entity/notepad";
import { SearchField } from "@/src/feature";
import { matchesSearchQuery } from "@/src/feature/search-field/util";

import { BookmarkItem } from "./component";

type Props = {
  bookmarks: BookmarkEntry[];
  open: boolean;
  onClose: () => void;
  onOpen: (bookmarkId: string) => void;
  onRemove: (bookmarkId: string) => void;
};

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
    <div className="bookmark">
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
