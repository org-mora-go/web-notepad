"use client";

import { useRef, useState } from "react";
import {
  useEditorFocus,
  useNotepadShortcuts,
  useStoreHydrated,
  useTabStrip,
} from "@/src/home/hook";
import { useNotepadStore } from "@/src/home/store";
import { HistoryPanel, NoteEditor, StatusBar, TabStrip } from "./component";
import "./style";

export function Home() {
  const hydrated = useStoreHydrated();
  const [historyOpen, setHistoryOpen] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const {
    tabs,
    activeTabId,
    unsavedSnapshots,
    addTab,
    selectTab,
    updateTab,
    closeTab,
    restoreSnapshot,
    deleteSnapshot,
    clearHistory,
  } = useNotepadStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const lineCount = activeTab?.content.split("\n").length ?? 1;

  useNotepadShortcuts({ editorRef, composingRef });
  useEditorFocus(editorRef, activeTabId, hydrated);
  const tabStrip = useTabStrip(tabs.length, activeTabId, hydrated);

  if (!hydrated || !activeTab) {
    return (
      <main className="notepad-shell is-loading">
        <span className="loading-mark">NOTEPAD_</span>
      </main>
    );
  }

  return (
    <main className="notepad-shell">
      <section className="workspace">
        <TabStrip
          tabs={tabs}
          activeTabId={activeTab.id}
          tabsScrollRef={tabStrip.tabsScrollRef}
          tabListRef={tabStrip.tabListRef}
          tabsOverflowing={tabStrip.tabsOverflowing}
          tabListOpen={tabStrip.tabListOpen}
          setTabListOpen={tabStrip.setTabListOpen}
          onSelect={selectTab}
          onClose={closeTab}
          onAdd={addTab}
        />

        <NoteEditor
          tab={activeTab}
          lineCount={lineCount}
          editorRef={editorRef}
          composingRef={composingRef}
          onChange={(content) => updateTab(activeTab.id, content)}
        />

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
