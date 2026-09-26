"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import { Menu, Plus, X } from "lucide-react";
import type { NoteTab } from "@/src/home/store";

type Props = {
  tabs: NoteTab[];
  activeTabId: string;
  tabsScrollRef: RefObject<HTMLDivElement | null>;
  tabListRef: RefObject<HTMLDivElement | null>;
  tabsOverflowing: boolean;
  tabListOpen: boolean;
  setTabListOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onAdd: () => void;
};

export function TabStrip({
  tabs,
  activeTabId,
  tabsScrollRef,
  tabListRef,
  tabsOverflowing,
  tabListOpen,
  setTabListOpen,
  onSelect,
  onClose,
  onAdd,
}: Props) {
  return (
    <div className="tab-strip" role="tablist" aria-label="메모 탭">
      <div
        className={`tabs-scroll ${tabsOverflowing ? "is-overflowing" : ""}`}
        ref={tabsScrollRef}
      >
        {tabs.map((tab) => {
          const dirty = tab.content.trim() !== "" && tab.content !== tab.savedContent;
          return (
            <div
              className={`tab-item ${tab.id === activeTabId ? "is-active" : ""} ${dirty ? "is-dirty" : ""}`}
              key={tab.id}
            >
              <button
                className="tab-select"
                type="button"
                role="tab"
                aria-selected={tab.id === activeTabId}
                onClick={() => onSelect(tab.id)}
              >
                <span className={`dirty-dot ${dirty ? "is-dirty" : ""}`} />
                <span className="tab-title">{tab.title}</span>
              </button>
              <button
                className="tab-close"
                type="button"
                onClick={() => onClose(tab.id)}
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
        onClick={onAdd}
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
                    className={`tab-list-select ${tab.id === activeTabId ? "is-active" : ""}`}
                    onClick={() => {
                      onSelect(tab.id);
                      setTabListOpen(false);
                    }}
                  >
                    {tab.title}
                  </button>
                  <button
                    type="button"
                    className="tab-list-close"
                    onClick={() => onClose(tab.id)}
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
  );
}
