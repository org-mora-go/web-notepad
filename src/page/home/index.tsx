"use client";

import "./style/index.scss";

import { useHome } from "@/src/page/home/hook";
import { Bookmark, Group, ShortcutHelp } from "@/src/widget";

import { Loading, PaneView, StatusBar } from "./component";

export function Home() {
  const {
    hydrated,
    bookmarksOpen,
    setBookmarksOpen,
    groupsOpen,
    setGroupsOpen,
    shortcutsOpen,
    setShortcutsOpen,
    activeGroupId,
    selectGroup,
    activeTab,
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
    renameGroup,
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
          bookmarkCount={bookmarks.length}
          shortcutsOpen={shortcutsOpen}
          bookmarksOpen={bookmarksOpen}
          groupCount={groupCount}
          activeGroupName={activeGroupName}
          groupsOpen={groupsOpen}
          onToggleShortcuts={() => {
            setShortcutsOpen((open) => !open);
            setBookmarksOpen(false);
            setGroupsOpen(false);
          }}
          onToggleBookmarks={() => {
            setBookmarksOpen((open) => !open);
            setGroupsOpen(false);
            setShortcutsOpen(false);
          }}
          onToggleGroups={() => {
            setGroupsOpen((open) => !open);
            setBookmarksOpen(false);
            setShortcutsOpen(false);
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
        onRename={renameGroup}
      />
      <ShortcutHelp
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </main>
  );
}
