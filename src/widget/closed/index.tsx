"use client";

import { Ghost, X } from "lucide-react";
import { useState } from "react";

import type { ClosedTabEntry, GroupEntry } from "@/src/entity/notepad";
import { SearchField } from "@/src/feature";
import { matchesSearchQuery } from "@/src/feature/search-field/util";

import { ClosedDeletePopup, ClosedItem } from "./component";

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
    <div className="closed">
      <div
        className={`closed-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="closed-panel"
        className={`closed-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="closed-header">
          <h2>Closed</h2>
          <button
            className="panel-close"
            type="button"
            onClick={onClose}
            aria-label="닫은 탭 패널 닫기"
          >
            <X size={12} />
          </button>
        </div>
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
                onRestore={onRestore}
                onRemove={setDeletingEntryId}
              />
            ))
          )}
        </div>
      </aside>
      {deletingEntryId && (
        <ClosedDeletePopup
          onCancel={() => setDeletingEntryId(null)}
          onConfirm={() => {
            onRemove(deletingEntryId);
            setDeletingEntryId(null);
          }}
        />
      )}
    </div>
  );
}
