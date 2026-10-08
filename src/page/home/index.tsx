"use client";

import "./index.scss";

import { useHome } from "@/src/page/home/hook";
import { Bookmark, Closed, GlobalSearch, Group, Shortcut } from "@/src/widget";

import { Loading, PaneView, StatusBar, TabDeletePopup } from "./component";

export function Home() {
  const {
    hydrated,
    closedTabs,
    restoreClosedTab,
    removeClosedTab,
    closedSearchQuery,
    setClosedSearchQuery,
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
          closedOpen={openPanel === "closed"}
          bookmarkCount={bookmarks.length}
          shortcutsOpen={openPanel === "shortcuts"}
          bookmarksOpen={openPanel === "bookmarks"}
          groupCount={groupCount}
          activeGroupName={activeGroupName}
          groupsOpen={openPanel === "groups"}
          globalSearchOpen={openPanel === "global-search"}
          onToggleClosed={() => toggleSidePanel("closed")}
          onToggleShortcuts={() => toggleSidePanel("shortcuts")}
          onToggleBookmarks={() => toggleSidePanel("bookmarks")}
          onToggleGroups={() => toggleSidePanel("groups")}
          onToggleGlobalSearch={() => toggleSidePanel("global-search")}
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
      <Closed
        closedTabs={closedTabs}
        groups={groups}
        searchQuery={closedSearchQuery}
        open={openPanel === "closed"}
        onClose={closeSidePanels}
        onSearchQueryChange={setClosedSearchQuery}
        onRestore={(entryId) => {
          restoreClosedTab(entryId);
          closeSidePanels();
        }}
        onRemove={removeClosedTab}
      />
      <GlobalSearch
        groups={groups}
        closedTabs={closedTabs}
        open={openPanel === "global-search"}
        onClose={closeSidePanels}
        onSelectGroup={(groupId) => {
          selectGroup(groupId);
          closeSidePanels();
        }}
        onOpenBookmark={(groupId, bookmarkId) => {
          selectGroup(groupId);
          openBookmark(bookmarkId);
          closeSidePanels();
        }}
        onOpenClosedSearch={(query) => {
          setClosedSearchQuery(query);
          toggleSidePanel("closed");
        }}
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
