"use client";

import "./style/index.scss";

import { useHome } from "@/src/page/home/hook";
import { Bookmark, Group } from "@/src/widget";

import { Loading, PaneView, StatusBar } from "./component";

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
          {leftPaneProps && <PaneView {...leftPaneProps} />}
          {rightPaneProps && <PaneView {...rightPaneProps} />}
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

      <Bookmark
        bookmarks={bookmarks}
        open={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onOpen={(bookmarkId) => {
          openBookmark(bookmarkId);
          setBookmarksOpen(false);
        }}
        onRemove={removeBookmark}
      />
      <Group
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
