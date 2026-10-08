"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import type { ClosedTabEntry } from "@/src/entity/notepad";
import { ExpandableContent } from "@/src/entity/ui";
import { formatDate } from "@/src/entity/util";
import { SearchHighlight } from "@/src/feature/search-field/component";

type Props = {
  entry: ClosedTabEntry;
  groupName: string;
  searchQuery: string;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};

export function ClosedItem({ entry, groupName, searchQuery, onRestore, onRemove }: Props) {
  return (
    <article className="closed-item">
      <div className="closed-item-heading">
        <strong title={groupName}>
          <SearchHighlight text={groupName} query={searchQuery} />
        </strong>
        <time dateTime={new Date(entry.closedAt).toISOString()}>
          {formatDate(entry.closedAt)}
        </time>
      </div>
      <ExpandableContent
        content={<SearchHighlight text={entry.tab.content} query={searchQuery} />}
      />
      <div className="closed-actions">
        <button type="button" onClick={() => onRestore(entry.id)}>
          <RotateCcw size={14} />
          복원
        </button>
        <button
          className="remove-closed"
          type="button"
          onClick={() => onRemove(entry.id)}
          aria-label={`${entry.tab.title} 닫힌 탭 삭제`}
          title="닫힌 탭 삭제"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
