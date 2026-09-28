"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useEditorFocus,
  useNotepadShortcuts,
  useStoreHydrated,
  useTabStrip,
} from "@/src/page/home/hook";
import { useNotepadStore } from "@/src/page/home/store";
import type { PaneDropZone } from "@/src/entity";
import { HistoryPanel, StatusBar } from "./component";
import { NotePane } from "@/src/widget";
import "./style/index.scss";

export function Home() {
  const hydrated = useStoreHydrated();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const rightEditorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const rightComposingRef = useRef(false);
  const {
    tabs,
    activeTabId,
    rightTabIds,
    activeRightTabId,
    activePane,
    splitRatio,
    unsavedSnapshots,
    addTab,
    selectTab,
    updateTab,
    moveTab,
    moveTabToPane,
    setActivePane,
    setSplitRatio,
    toggleUrgent,
    closeTab,
    restoreSnapshot,
    deleteSnapshot,
    clearHistory,
  } = useNotepadStore();

  const rightIds = useMemo(() => new Set(rightTabIds), [rightTabIds]);
  const leftTabs = tabs.filter((tab) => !rightIds.has(tab.id));
  const rightTabs = tabs.filter((tab) => rightIds.has(tab.id));
  const split = rightTabs.length > 0;
  const activeTab = leftTabs.find((tab) => tab.id === activeTabId) ?? leftTabs[0];
  const activeRightTab =
    rightTabs.find((tab) => tab.id === activeRightTabId) ?? rightTabs[0];
  const lineCount = activeTab?.content.split("\n").length ?? 1;

  useNotepadShortcuts({ editorRef, composingRef });
  useEditorFocus(editorRef, activeTabId, hydrated);
  useEditorFocus(rightEditorRef, activeRightTabId ?? "", hydrated);

  // Keep the caret in the pane that shortcuts just moved to.
  useEffect(() => {
    if (!hydrated) return;
    const frame = window.requestAnimationFrame(() => {
      const target = activePane === "right" ? rightEditorRef.current : editorRef.current;
      target?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePane, hydrated]);
  const leftStrip = useTabStrip(leftTabs.length, activeTabId, hydrated);
  const rightStrip = useTabStrip(rightTabs.length, activeRightTabId ?? "", hydrated);

  const draggingPane = draggingTabId
    ? rightIds.has(draggingTabId)
      ? "right"
      : "left"
    : null;

  const dropTo = (pane: "left" | "right") => () => {
    if (draggingTabId) moveTabToPane(draggingTabId, pane);
    setDraggingTabId(null);
  };

  // The source pane can unmount on drop, so its dragend never fires.
  const adoptTo = (pane: "left" | "right") => (tabId: string) => {
    moveTabToPane(tabId, pane);
    setDraggingTabId(null);
  };

  const leftDropZones: PaneDropZone[] = [];
  if (draggingPane === "right") {
    leftDropZones.push({ key: "adopt", label: "Move here", onDrop: dropTo("left") });
  } else if (draggingPane === "left" && !split && leftTabs.length > 1) {
    leftDropZones.push({
      key: "split",
      label: "Split right",
      half: true,
      onDrop: dropTo("right"),
    });
  }

  const rightDropZones: PaneDropZone[] =
    draggingPane === "left"
      ? [{ key: "adopt", label: "Move here", onDrop: dropTo("right") }]
      : [];

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
          <NotePane
            tabs={leftTabs}
            activeTab={activeTab}
            tabStrip={leftStrip}
            editorRef={editorRef}
            composingRef={composingRef}
            autoFocus
            isFocused={!split || activePane === "left"}
            draggingTabId={draggingTabId}
            dropZones={leftDropZones}
            widthRatio={split ? splitRatio : undefined}
            onActivate={() => setActivePane("left")}
            onSelect={selectTab}
            onClose={closeTab}
            onMove={moveTab}
            onAdopt={adoptTo("left")}
            onDragStateChange={setDraggingTabId}
            onToggleUrgent={toggleUrgent}
            onAdd={() => addTab()}
            onChange={(content) => updateTab(activeTab.id, content)}
          />

          {split && activeRightTab && (
            <NotePane
              tabs={rightTabs}
              activeTab={activeRightTab}
              tabStrip={rightStrip}
              editorRef={rightEditorRef}
              composingRef={rightComposingRef}
              isFocused={activePane === "right"}
              draggingTabId={draggingTabId}
              dropZones={rightDropZones}
              onResize={setSplitRatio}
              onActivate={() => setActivePane("right")}
              onSelect={selectTab}
              onClose={closeTab}
              onMove={moveTab}
              onAdopt={adoptTo("right")}
              onDragStateChange={setDraggingTabId}
              onToggleUrgent={toggleUrgent}
              onAdd={() => addTab("right")}
              onChange={(content) => updateTab(activeRightTab.id, content)}
            />
          )}
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
