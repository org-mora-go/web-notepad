"use client";

import { useHome } from "@/src/page/home/hook";
import { HistoryPanel, Loading, StatusBar } from "./component";
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
  } = useHome();

  if (!hydrated || !activeTab) {
    return <Loading />;
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
