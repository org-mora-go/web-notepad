"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Clock3,
  FileClock,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNotepadStore } from "@/app/store/notepad-store";

const AUTOSAVE_INTERVAL = 30_000;

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

const subscribeToHydration = (onStoreChange: () => void) =>
  useNotepadStore.persist?.onFinishHydration(onStoreChange) ?? (() => undefined);

const getHydrationSnapshot = () =>
  useNotepadStore.persist?.hasHydrated() ?? false;

function useStoreHydrated() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    () => false,
  );

  useEffect(() => {
    void useNotepadStore.persist?.rehydrate();
  }, []);

  return hydrated;
}

export default function Home() {
  const hydrated = useStoreHydrated();
  const [historyOpen, setHistoryOpen] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineRailRef = useRef<HTMLDivElement>(null);
  const {
    tabs,
    activeTabId,
    unsavedSnapshots,
    addTab,
    selectTab,
    updateTab,
    saveTab,
    closeTab,
    restoreSnapshot,
    deleteSnapshot,
  } = useNotepadStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const isDirty = activeTab?.content !== activeTab?.savedContent;
  const lineCount = activeTab?.content.split("\n").length ?? 1;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.metaKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        editorRef.current?.focus();
        editorRef.current?.select();
        return;
      }

      if (event.metaKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        const { activeTabId: currentTabId, saveTab: saveCurrentTab } =
          useNotepadStore.getState();
        saveCurrentTab(currentTabId);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const state = useNotepadStore.getState();
      state.tabs.forEach((tab) => state.snapshotTab(tab.id));
    }, AUTOSAVE_INTERVAL);

    return () => window.clearInterval(interval);
  }, []);

  if (!hydrated || !activeTab) {
    return (
      <main className="notepad-shell loading-shell">
        <span className="loading-mark">NOTEPAD_</span>
      </main>
    );
  }

  return (
    <main className="notepad-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">N</span>
          <div>
            <strong>NOTEPAD</strong>
            <span>LOCAL WORKSPACE</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className={`icon-command save-command ${isDirty ? "is-dirty" : ""}`}
            type="button"
            onClick={() => saveTab(activeTab.id)}
            aria-label="현재 탭 저장"
            title="저장 (⌘S)"
          >
            <Save size={17} strokeWidth={1.8} />
            <span>SAVE</span>
          </button>
          <button
            className={`icon-command ${historyOpen ? "is-active" : ""}`}
            type="button"
            onClick={() => setHistoryOpen((open) => !open)}
            aria-expanded={historyOpen}
            aria-controls="unsaved-history"
          >
            <FileClock size={17} strokeWidth={1.8} />
            <span>UNSAVED</span>
            <span className="history-count">{unsavedSnapshots.length}</span>
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="tab-strip" role="tablist" aria-label="메모 탭">
          <div className="tabs-scroll">
            {tabs.map((tab) => {
              const dirty = tab.content !== tab.savedContent;
              return (
                <div
                  className={`tab-item ${tab.id === activeTab.id ? "is-active" : ""} ${dirty ? "is-dirty" : ""}`}
                  key={tab.id}
                >
                  <button
                    className="tab-select"
                    type="button"
                    role="tab"
                    aria-selected={tab.id === activeTab.id}
                    onClick={() => selectTab(tab.id)}
                  >
                    <span className={`dirty-dot ${dirty ? "is-dirty" : ""}`} />
                    <span className="tab-title">{tab.title}</span>
                  </button>
                  <button
                    className="tab-close"
                    type="button"
                    onClick={() => closeTab(tab.id)}
                    aria-label={`${tab.title} 닫기`}
                    title="탭 닫기"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            className="add-tab"
            type="button"
            onClick={addTab}
            aria-label="새 탭 추가"
            title="새 탭"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="editor-wrap">
          <div className="line-rail" ref={lineRailRef} aria-hidden="true">
            {Array.from({ length: lineCount }, (_, index) => (
              <span key={index}>{String(index + 1).padStart(2, "0")}</span>
            ))}
          </div>
          <textarea
            ref={editorRef}
            className="note-editor"
            value={activeTab.content}
            onChange={(event) => updateTab(activeTab.id, event.target.value)}
            onScroll={(event) => {
              if (lineRailRef.current) {
                lineRailRef.current.scrollTop = event.currentTarget.scrollTop;
              }
            }}
            placeholder="기록을 시작하세요."
            autoFocus
            spellCheck={false}
            aria-label={`${activeTab.title} 메모 내용`}
          />
        </div>

        <footer className="statusbar">
          <div className="save-state">
            <span className={`status-light ${isDirty ? "is-dirty" : ""}`} />
            {isDirty ? "UNSAVED CHANGES" : "SAVED LOCALLY"}
          </div>
          <div className="status-meta">
            <span>{activeTab.content.length} CHARS</span>
            <span>{lineCount} LINES</span>
            <span>UTF-8</span>
          </div>
        </footer>
      </section>

      <div
        className={`history-backdrop ${historyOpen ? "is-visible" : ""}`}
        onClick={() => setHistoryOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="unsaved-history"
        className={`history-panel ${historyOpen ? "is-open" : ""}`}
        aria-hidden={!historyOpen}
      >
        <div className="history-header">
          <div>
            <span className="eyebrow">LOCAL ARCHIVE</span>
            <h2>Unsaved history</h2>
          </div>
          <button
            className="panel-close"
            type="button"
            onClick={() => setHistoryOpen(false)}
            aria-label="이력 닫기"
          >
            <X size={19} />
          </button>
        </div>

        <div className="history-list">
          {unsavedSnapshots.length === 0 ? (
            <div className="history-empty">
              <Clock3 size={26} strokeWidth={1.4} />
              <p>Empty History</p>
            </div>
          ) : (
            unsavedSnapshots.map((snapshot) => (
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
                      restoreSnapshot(snapshot.id);
                      setHistoryOpen(false);
                    }}
                  >
                    <RotateCcw size={14} />
                    복원
                  </button>
                  <button
                    className="delete-history"
                    type="button"
                    onClick={() => deleteSnapshot(snapshot.id)}
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
    </main>
  );
}
