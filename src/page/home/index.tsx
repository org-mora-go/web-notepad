"use client";

import "./style/index.scss";

import { useHome } from "@/src/page/home/hook";
import { NotePane } from "@/src/widget";

import { BookmarkPanel, GroupPanel, Loading, StatusBar } from "./component";

export function Home() {
  const {
    hydrated,
    bookmarksOpen,
    setBookmarksOpen,
    groupsOpen,
    setGroupsOpen,
    activeGroupId,
    selectGroup,
    activeTab,
    lineCount,
    split,
    bookmarks,
    groups,
    groupCount,
    activeGroupName,
    leftPaneProps,
    rightPaneProps,
    openBookmark,
    removeBookmark,
    createGroup,
    removeGroup,
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
          bookmarkCount={bookmarks.length}
          bookmarksOpen={bookmarksOpen}
          groupCount={groupCount}
          activeGroupName={activeGroupName}
          groupsOpen={groupsOpen}
          onToggleBookmarks={() => {
            setBookmarksOpen((open) => !open);
            setGroupsOpen(false);
          }}
          onToggleGroups={() => {
            setGroupsOpen((open) => !open);
            setBookmarksOpen(false);
          }}
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
      <GroupPanel
        groups={groups}
        activeGroupId={activeGroupId}
        open={groupsOpen}
        onClose={() => setGroupsOpen(false)}
        onCreate={(name) => {
          createGroup(name);
          setGroupsOpen(false);
        }}
        onSelect={(groupId) => {
          selectGroup(groupId);
          setGroupsOpen(false);
        }}
        onRemove={removeGroup}
      />
    </main>
  );
}
