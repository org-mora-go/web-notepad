"use client";

import type { ClosedTabEntry, GroupEntry } from "@/src/entity/notepad";
import { SidePanel } from "@/src/entity/ui";
import { SearchField } from "@/src/feature";
import { matchesSearchQuery } from "@/src/feature/search-field/util";

import { SearchResult, SearchResultSection } from "./component";

type Props = {
  groups: GroupEntry[];
  closedTabs: ClosedTabEntry[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  open: boolean;
  onClose: () => void;
  onSelectGroup: (groupId: string) => void;
  onOpenBookmark: (groupId: string, bookmarkId: string) => void;
  onOpenClosedSearch: (query: string) => void;
};

export function GlobalSearch({
  groups,
  closedTabs,
  searchQuery,
  onSearchQueryChange,
  open,
  onClose,
  onSelectGroup,
  onOpenBookmark,
  onOpenClosedSearch,
}: Props) {
  const query = searchQuery.trim();
  const groupResults = query
    ? groups.filter((group) => matchesSearchQuery(query, group.name))
    : [];
  const bookmarkResults = query
    ? groups.flatMap((group) =>
        group.bookmarks
          .filter((bookmark) =>
            matchesSearchQuery(query, group.name, bookmark.title, bookmark.content),
          )
          .map((bookmark) => ({ group, bookmark })),
      )
    : [];
  const closedResults = query
    ? closedTabs
        .map((entry) => ({
          entry,
          groupName:
            groups.find((group) => group.id === entry.groupId)?.name ?? "Ungrouped",
        }))
        .filter(({ entry, groupName }) =>
          matchesSearchQuery(query, groupName, entry.tab.title, entry.tab.content),
        )
    : [];
  const resultCount =
    groupResults.length + bookmarkResults.length + closedResults.length;

  return (
    <SidePanel
      className="global-search"
      id="global-search-panel"
      title="Search"
      open={open}
      closeLabel="전체 검색 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="전체 검색"
        placeholder="Search everything"
        onChange={onSearchQueryChange}
      />
      <div className="global-search-list">
        {!query ? (
          <div className="global-search-empty-state">
            <p>Enter a search term</p>
          </div>
        ) : resultCount === 0 ? (
          <div className="global-search-empty-state">
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          <>
            {groupResults.length > 0 && (
              <SearchResultSection title="Groups" className="global-search-groups">
                {groupResults.map((group) => (
                  <SearchResult
                    key={group.id}
                    category="Group"
                    title={group.name}
                    query={query}
                    ariaLabel={`그룹 ${group.name} 선택`}
                    onSelect={() => onSelectGroup(group.id)}
                  />
                ))}
              </SearchResultSection>
            )}
            {bookmarkResults.length > 0 && (
              <SearchResultSection title="Bookmarks" className="global-search-bookmarks">
                {bookmarkResults.map(({ group, bookmark }) => (
                  <SearchResult
                    key={`${group.id}:${bookmark.id}`}
                    category="Bookmark"
                    groupName={group.name}
                    title={bookmark.title}
                    description={bookmark.content}
                    query={query}
                    ariaLabel={`북마크 ${bookmark.title} 열기`}
                    onSelect={() => onOpenBookmark(group.id, bookmark.id)}
                  />
                ))}
              </SearchResultSection>
            )}
            {closedResults.length > 0 && (
              <SearchResultSection title="Closed tabs" className="global-search-closed">
                {closedResults.map(({ entry, groupName }) => (
                  <SearchResult
                    key={entry.id}
                    category="Closed"
                    groupName={groupName}
                    title={entry.tab.title}
                    description={entry.tab.content}
                    query={query}
                    ariaLabel={`닫은 탭 ${entry.tab.title} 검색 결과 보기`}
                    onSelect={() => onOpenClosedSearch(query)}
                  />
                ))}
              </SearchResultSection>
            )}
          </>
        )}
      </div>
    </SidePanel>
  );
}