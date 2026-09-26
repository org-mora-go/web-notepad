"use client";

import { FileClock } from "lucide-react";

type Props = {
  charCount: number;
  lineCount: number;
  historyOpen: boolean;
  onToggleHistory: () => void;
};

export function StatusBar({ charCount, lineCount, historyOpen, onToggleHistory }: Props) {
  return (
    <footer className="statusbar">
      <div className="save-state">
        <span className="status-light" />
        SAVED LOCALLY
      </div>
      <div className="status-meta">
        <span>{charCount} CHARS</span>
        <span className="status-lines">{lineCount} LINES</span>
        <div className="status-actions">
          <button
            className={`status-command ${historyOpen ? "is-active" : ""}`}
            type="button"
            onClick={onToggleHistory}
            aria-expanded={historyOpen}
            aria-controls="unsaved-history"
          >
            <FileClock size={13} strokeWidth={1.8} />
            <span>HISTORY</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
