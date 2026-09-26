"use client";

import { useState } from "react";
import { Clock3, RotateCcw, Trash2, X } from "lucide-react";
import type { UnsavedSnapshot } from "@/src/home/store";

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

type Props = {
  snapshots: UnsavedSnapshot[];
  open: boolean;
  onClose: () => void;
  onRestore: (snapshotId: string) => void;
  onDelete: (snapshotId: string) => void;
  onClear: () => void;
};

export function HistoryPanel({
  snapshots,
  open,
  onClose,
  onRestore,
  onDelete,
  onClear,
}: Props) {
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  return (
    <>
      <div
        className={`history-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {clearConfirmOpen && (
        <>
          <div
            className="clear-confirm-backdrop"
            onClick={() => setClearConfirmOpen(false)}
            aria-hidden="true"
          />
          <div className="clear-confirm-modal" role="dialog" aria-modal="true">
            <p>Everything will be deleted.</p>
            <div className="clear-confirm-actions">
              <button type="button" onClick={() => setClearConfirmOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete"
                onClick={() => {
                  onClear();
                  setClearConfirmOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
      <aside
        id="unsaved-history"
        className={`history-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="history-header">
          <div className="history-header-main">
            <span className="eyebrow">LOCAL ARCHIVE</span>
            <div className="history-title-row">
              <h2>History</h2>
              {snapshots.length > 0 && (
                <button
                  className="clear-history-button"
                  type="button"
                  onClick={() => setClearConfirmOpen(true)}
                  aria-label="기록 전체 삭제"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <button
            className="panel-close"
            type="button"
            onClick={onClose}
            aria-label="이력 닫기"
          >
            <X size={19} />
          </button>
        </div>

        <div className="history-list">
          {snapshots.length === 0 ? (
            <div className="history-empty">
              <Clock3 size={26} strokeWidth={1.4} />
              <p>Empty History</p>
            </div>
          ) : (
            snapshots.map((snapshot) => (
              <article className="history-item" key={snapshot.id}>
                <div className="history-item-heading">
                  <strong>{snapshot.name}</strong>
                  <time dateTime={new Date(snapshot.capturedAt).toISOString()}>
                    {formatDate(snapshot.capturedAt)}
                  </time>
                </div>
                <span className="history-source">FROM {snapshot.sourceTitle}</span>
                <p>{snapshot.content}</p>
                <div className="history-actions">
                  <button
                    type="button"
                    onClick={() => {
                      onRestore(snapshot.id);
                      onClose();
                    }}
                  >
                    <RotateCcw size={14} />
                    복원
                  </button>
                  <button
                    className="delete-history"
                    type="button"
                    onClick={() => onDelete(snapshot.id)}
                    aria-label={`${snapshot.name} 삭제`}
                    title="이력 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
