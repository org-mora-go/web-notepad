"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Clock3,
  FileClock,
  Menu,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useNotepadStore } from "@/app/store/notepad-store";

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
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [tabsOverflowing, setTabsOverflowing] = useState(false);
  const [tabListOpen, setTabListOpen] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const lineRailRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const state = useNotepadStore.getState();
      const { tabs, activeTabId } = state;
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
      const editor = editorRef.current;

      // The Korean IME swallows the first shortcut key while composing, so commit as soon as a modifier is held.
      if (
        composingRef.current &&
        (event.metaKey || event.altKey) &&
        editor &&
        document.activeElement === editor
      ) {
        composingRef.current = false;
        editor.blur();
        editor.focus();
      }

      if (
        (event.metaKey || event.altKey) &&
        !event.ctrlKey &&
        (event.key.toLowerCase() === "a" || event.code === "KeyA")
      ) {
        if (!editor) return;
        event.preventDefault();
        const selectAll = () => {
          editor.focus();
          editor.setSelectionRange(0, editor.value.length);
        };
        selectAll();
        window.requestAnimationFrame(selectAll);
        window.setTimeout(selectAll, 50);
        return;
      }

      const shouldAddTab =
        (event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "n") ||
        (event.altKey && !event.ctrlKey && !event.metaKey &&
          event.key.toLowerCase() === "n");

      if (shouldAddTab) {
        event.preventDefault();
        state.addTab();
        return;
      }

      const shouldCloseTab =
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        (event.key.toLowerCase() === "w" ||
          event.key === "Backspace" ||
          event.code === "Backspace");

      if (shouldCloseTab) {
        event.preventDefault();
        state.closeTab(activeTabId);
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey && event.key === "Tab") {
        event.preventDefault();
        state.addTab();
        return;
      }

      const isArrowLeft =
        event.key === "ArrowLeft" || event.key === "Left" || event.code === "ArrowLeft";
      const isArrowRight =
        event.key === "ArrowRight" || event.key === "Right" || event.code === "ArrowRight";

      if (event.altKey && !event.ctrlKey && !event.metaKey && (isArrowLeft || isArrowRight)) {
        if (tabs.length <= 1) {
          return;
        }

        event.preventDefault();
        const nextIndex = isArrowLeft ? activeIndex - 1 : activeIndex + 1;
        if (nextIndex >= 0 && nextIndex < tabs.length) {
          state.selectTab(tabs[nextIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const frame = window.requestAnimationFrame(() => {
      const currentTab = useNotepadStore
        .getState()
        .tabs.find((tab) => tab.id === activeTabId);
      const editor = editorRef.current;
      if (!currentTab || !editor) return;

      editor.focus();
      editor.setSelectionRange(currentTab.content.length, currentTab.content.length);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTabId, hydrated]);

  useEffect(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const update = () => {
      const overflowing = scroller.scrollWidth > scroller.clientWidth;
      setTabsOverflowing(overflowing);
      if (!overflowing) setTabListOpen(false);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [tabs.length, hydrated]);

  useEffect(() => {
    tabsScrollRef.current
      ?.querySelector(".tab-item.is-active")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeTabId, hydrated]);

  useEffect(() => {
    if (!tabListOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!tabListRef.current?.contains(event.target as Node)) setTabListOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTabListOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabListOpen]);

  if (!hydrated || !activeTab) {
    return (
      <main className="notepad-shell loading-shell">
        <span className="loading-mark">NOTEPAD_</span>
      </main>
    );
  }

  return (
    <main className="notepad-shell">
      <section className="workspace">
        <div className="tab-strip" role="tablist" aria-label="메모 탭">
          <div
            className={`tabs-scroll ${tabsOverflowing ? "is-overflowing" : ""}`}
            ref={tabsScrollRef}
          >
            {tabs.map((tab) => {
              const dirty = tab.content.trim() !== "" && tab.content !== tab.savedContent;
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
          {tabsOverflowing && (
            <div className="tab-list-wrap" ref={tabListRef}>
              <button
                className={`tab-list-toggle ${tabListOpen ? "is-active" : ""}`}
                type="button"
                onClick={() => setTabListOpen((open) => !open)}
                aria-label="탭 목록"
                aria-expanded={tabListOpen}
                aria-controls="tab-list-menu"
                title="탭 목록"
              >
                <Menu size={16} />
              </button>
              {tabListOpen && (
                <ul id="tab-list-menu" className="tab-list-menu" role="menu">
                  {tabs.map((tab) => (
                    <li key={tab.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className={`tab-list-select ${tab.id === activeTab.id ? "is-active" : ""}`}
                        onClick={() => {
                          selectTab(tab.id);
                          setTabListOpen(false);
                        }}
                      >
                        {tab.title}
                      </button>
                      <button
                        type="button"
                        className="tab-list-close"
                        onClick={() => closeTab(tab.id)}
                        aria-label={`${tab.title} 닫기`}
                        title="탭 닫기"
                      >
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={() => {
              composingRef.current = false;
            }}
            onScroll={(event) => {
              if (lineRailRef.current) {
                lineRailRef.current.scrollTop = event.currentTarget.scrollTop;
              }
            }}
            placeholder="Take a note.."
            autoFocus
            spellCheck={false}
            aria-label={`${activeTab.title} 메모 내용`}
          />
        </div>

        <footer className="statusbar">
          <div className="save-state">
            <span className="status-light" />
            SAVED LOCALLY
          </div>
          <div className="status-meta">
            <span>{activeTab.content.length} CHARS</span>
            <span>{lineCount} LINES</span>
            <span>UTF-8</span>
            <div className="status-actions">
              <button
                className={`icon-command status-command ${historyOpen ? "is-active" : ""}`}
                type="button"
                onClick={() => setHistoryOpen((open) => !open)}
                aria-expanded={historyOpen}
                aria-controls="unsaved-history"
              >
                <FileClock size={13} strokeWidth={1.8} />
                <span>HISTORY</span>
              </button>
            </div>
          </div>
        </footer>
      </section>

      <div
        className={`history-backdrop ${historyOpen ? "is-visible" : ""}`}
        onClick={() => setHistoryOpen(false)}
        aria-hidden="true"
      />
      {clearConfirmOpen && (
        <div
          className="clear-confirm-backdrop"
          onClick={() => setClearConfirmOpen(false)}
          aria-hidden="true"
        />
      )}
      {clearConfirmOpen && (
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
                clearHistory();
                setClearConfirmOpen(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      <aside
        id="unsaved-history"
        className={`history-panel ${historyOpen ? "is-open" : ""}`}
        aria-hidden={!historyOpen}
      >
        <div className="history-header">
          <div className="history-header-main">
            <span className="eyebrow">LOCAL ARCHIVE</span>
            <div className="history-title-row">
              <h2>History</h2>
              {unsavedSnapshots.length > 0 && (
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
