"use client";

import "./index.scss";

import { useHome } from "@/src/page/home/hook";
import { Bookmark, Closed, GlobalSearch, Group, Shortcut } from "@/src/widget";

import { Loading, PaneView, StatusBar, TabDeletePopup } from "./component";

export function Home() {
  const {
    hydrated,
    closedTabs,
    removeClosedTab,
    globalSearchQuery,
    setGlobalSearchQuery,
    closedSearchQuery,
    setClosedSearchQuery,
    pendingCloseTabId,
    cancelCloseTab,
    confirmCloseTab,
    openPanel,
    toggleSidePanel,
    closeSidePanels,
    activeGroupId,
    selectGroupAndClosePanel,
    openBookmarkAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    restoreClosedTabAndClosePanel,
    activeTab,
    split,
    bookmarks,
    groups,
    groupCount,
    activeGroupName,
    leftPaneProps,
    rightPaneProps,
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
          closedCount={closedTabs.length}
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
        onOpen={openBookmarkInCurrentGroupAndClosePanel}
        onRemove={removeBookmark}
      />
      <Group
        groups={groups}
        activeGroupId={activeGroupId}
        open={openPanel === "groups"}
        onClose={closeSidePanels}
        onCreate={createGroup}
        onSelect={selectGroupAndClosePanel}
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
        onRestore={restoreClosedTabAndClosePanel}
        onRemove={removeClosedTab}
      />
      <GlobalSearch
        groups={groups}
        closedTabs={closedTabs}
        searchQuery={globalSearchQuery}
        onSearchQueryChange={setGlobalSearchQuery}
        open={openPanel === "global-search"}
        onClose={closeSidePanels}
        onSelectGroup={selectGroupAndClosePanel}
        onOpenBookmark={openBookmarkAndClosePanel}
        onOpenClosedSearch={(query) => {
          setClosedSearchQuery(query);
          toggleSidePanel("closed");
        }}
      />
      <Shortcut open={openPanel === "shortcuts"} onClose={closeSidePanels} />
      {pendingCloseTabId && (
        <TabDeletePopup onConfirm={confirmCloseTab} onCancel={cancelCloseTab} />
      )}
    </main>
  );
}
