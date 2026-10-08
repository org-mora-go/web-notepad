"use client";

import { Ghost } from "lucide-react";
import { useState } from "react";

import type { ClosedTabEntry, GroupEntry } from "@/src/entity/notepad";
import { ConfirmPopup, SidePanel } from "@/src/entity/ui";
import { SearchField } from "@/src/feature";
import { SearchHighlight } from "@/src/feature/search-field/component";
import { matchesSearchQuery } from "@/src/feature/search-field/util";

import { ClosedItem } from "./component";

type Props = {
  closedTabs: ClosedTabEntry[];
  groups: GroupEntry[];
  open: boolean;
  onClose: () => void;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};

export function Closed({
  closedTabs,
  groups,
  open,
  onClose,
  onRestore,
  onRemove,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  // Tabs whose group was deleted are listed (and restored) under Ungrouped.
  const entries = closedTabs.map((entry) => ({
    entry,
    groupName: groups.find((group) => group.id === entry.groupId)?.name ?? "Ungrouped",
  }));
  const filteredEntries = entries.filter(({ entry, groupName }) =>
    matchesSearchQuery(searchQuery, groupName, entry.tab.content),
  );

  return (
    <SidePanel
      className="closed"
      id="closed-panel"
      title="Closed"
      open={open}
      closeLabel="닫은 탭 패널 닫기"
      onClose={onClose}
    >
      <SearchField
        value={searchQuery}
        ariaLabel="닫은 탭 검색"
        placeholder="Search closed tabs"
        onChange={setSearchQuery}
      />
      <div className="closed-list">
        {closedTabs.length === 0 ? (
          <div className="closed-empty">
            <Ghost size={26} strokeWidth={1.4} />
            <p>Empty Closed</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="search-empty-state">
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          filteredEntries.map(({ entry, groupName }) => (
            <ClosedItem
              key={entry.id}
              entry={entry}
              groupName={groupName}
              searchQuery={searchQuery}
              onRestore={onRestore}
              onRemove={setDeletingEntryId}
            />
          ))
        )}
      </div>
    {deletingEntryId && (
      <ConfirmPopup
        title="Delete closed tab"
        message="This closed tab will be permanently deleted and cannot be restored. Do you want to delete it?"
        closeLabel="삭제 확인 닫기"
        closeTitle="닫기"
        onCancel={() => setDeletingEntryId(null)}
        onConfirm={() => {
          onRemove(deletingEntryId);
          setDeletingEntryId(null);
        }}
      />
    )}
    </SidePanel>
  );
}
