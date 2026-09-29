"use client";

import { useHome } from "@/src/page/home/hook";
import { BookmarkPanel, Loading, StatusBar } from "./component";
import { NotePane } from "@/src/widget";
import "./style/index.scss";

export function Home() {
  const {
    hydrated,
    bookmarksOpen,
    setBookmarksOpen,
    activeTab,
    lineCount,
    split,
    bookmarks,
    leftPaneProps,
    rightPaneProps,
    openBookmark,
    removeBookmark,
  } = useHome();

  if (!hydrated || !activeTab) {
    return <Loading />;
  }

  return (
    <main className="home">
      <section className="workspace">
        <div className={`pane-group ${split ? "is-split" : ""}`}>
          {leftPaneProps && <NotePane {...leftPaneProps} />}
          {rightPaneProps && <NotePane {...rightPaneProps} />}
        </div>

        <StatusBar
          lineCount={lineCount}
          bookmarksOpen={bookmarksOpen}
          onToggleBookmarks={() => setBookmarksOpen((open) => !open)}
        />
      </section>

      <BookmarkPanel
        bookmarks={bookmarks}
        open={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onOpen={(bookmarkId) => {
          openBookmark(bookmarkId);
          setBookmarksOpen(false);
        }}
        onRemove={removeBookmark}
      />
    </main>
  );
}
