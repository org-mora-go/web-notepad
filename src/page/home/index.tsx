"use client";

import "./index.scss";

import { useHome } from "@/src/page/home/hook";
import { Bookmark, Group, Shortcut } from "@/src/widget";

import { Loading, PaneView, StatusBar, TabDeletePopup } from "./component";

export function Home() {
  const {
    hydrated,
    pendingCloseTabId,
    cancelCloseTab,
    confirmCloseTab,
    openPanel,
    toggleSidePanel,
    closeSidePanels,
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
          shortcutsOpen={openPanel === "shortcuts"}
          bookmarksOpen={openPanel === "bookmarks"}
          groupCount={groupCount}
          activeGroupName={activeGroupName}
          groupsOpen={openPanel === "groups"}
          onToggleShortcuts={() => toggleSidePanel("shortcuts")}
          onToggleBookmarks={() => toggleSidePanel("bookmarks")}
          onToggleGroups={() => toggleSidePanel("groups")}
        />
      </section>

      <Bookmark
        bookmarks={bookmarks}
        open={openPanel === "bookmarks"}
        onClose={closeSidePanels}
        onOpen={(bookmarkId) => {
          openBookmark(bookmarkId);
          closeSidePanels();
        }}
        onRemove={removeBookmark}
      />
      <Group
        groups={groups}
        activeGroupId={activeGroupId}
        open={openPanel === "groups"}
        onClose={closeSidePanels}
        onCreate={createGroup}
        onSelect={(groupId) => {
          selectGroup(groupId);
          closeSidePanels();
        }}
        onRemove={removeGroup}
        onRename={renameGroup}
      />
      <Shortcut
        open={openPanel === "shortcuts"}
        onClose={closeSidePanels}
      />
      {pendingCloseTabId && (
        <TabDeletePopup onConfirm={confirmCloseTab} onCancel={cancelCloseTab} />
      )}
    </main>
  );
}
