"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import { useExpandableContent } from "@/src/entity/hook";
import type { ClosedTabEntry } from "@/src/entity/notepad";
import { formatDate } from "@/src/entity/util";

type Props = {
  entry: ClosedTabEntry;
  groupName: string;
  onRestore: (entryId: string) => void;
  onRemove: (entryId: string) => void;
};

export function ClosedItem({ entry, groupName, onRestore, onRemove }: Props) {
  const { contentRef, expanded, canExpand, toggleExpanded } =
    useExpandableContent(entry.tab.content);

  return (
    <article className="closed-item">
      <div className="closed-item-heading">
        <strong title={groupName}>{groupName}</strong>
        <time dateTime={new Date(entry.closedAt).toISOString()}>
          {formatDate(entry.closedAt)}
        </time>
      </div>
      <p
        ref={contentRef}
        className={`closed-content ${expanded ? "is-expanded" : ""}`}
      >
        {entry.tab.content}
      </p>
      {(canExpand || expanded) && (
        <button
          className="closed-content-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={toggleExpanded}
        >
          {expanded ? "간소화" : "더보기"}
        </button>
      )}
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
