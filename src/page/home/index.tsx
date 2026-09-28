"use client";

import { useHomeWorkspace } from "@/src/page/home/hook";
import { HistoryPanel, StatusBar } from "./component";
import { NotePane } from "@/src/widget";
import "./style/index.scss";

export function Home() {
  const {
    hydrated,
    historyOpen,
    setHistoryOpen,
    activeTab,
    lineCount,
    split,
    unsavedSnapshots,
    leftPaneProps,
    rightPaneProps,
    restoreSnapshot,
    deleteSnapshot,
    clearHistory,
  } = useHomeWorkspace();

  if (!hydrated || !activeTab) {
    return (
      <main className="home is-loading">
        <span className="loading-mark">NOTEPAD_</span>
      </main>
    );
  }

  return (
    <main className="home">
      <section className="workspace">
        <div className={`pane-group ${split ? "is-split" : ""}`}>
          {leftPaneProps && <NotePane {...leftPaneProps} />}
          {rightPaneProps && <NotePane {...rightPaneProps} />}
        </div>

        <StatusBar
          charCount={activeTab.content.length}
          lineCount={lineCount}
          historyOpen={historyOpen}
          onToggleHistory={() => setHistoryOpen((open) => !open)}
        />
      </section>

      <HistoryPanel
        snapshots={unsavedSnapshots}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={restoreSnapshot}
        onDelete={deleteSnapshot}
        onClear={clearHistory}
      />
    </main>
  );
}
