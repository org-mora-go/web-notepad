"use client";

import { useState, type RefObject } from "react";
import { Plus } from "lucide-react";
import type { NoteTab } from "@/src/page/home/store";
import { TabItem } from "./tab-item";

type Props = {
  tabs: NoteTab[];
  activeTabId: string;
  tabsScrollRef: RefObject<HTMLDivElement | null>;
  tabsOverflowing: boolean;
  draggingTabId: string | null;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onMove: (fromTabId: string, toTabId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStateChange: (tabId: string | null) => void;
  onToggleUrgent: (tabId: string) => void;
  onAdd: () => void;
};

export function TabStrip({
  tabs,
  activeTabId,
  tabsScrollRef,
  tabsOverflowing,
  draggingTabId,
  onSelect,
  onClose,
  onMove,
  onAdopt,
  onDragStateChange,
  onToggleUrgent,
  onAdd,
}: Props) {
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const dragActive = draggingTabId !== null;

  const endDrag = () => {
    setDropTargetId(null);
    onDragStateChange(null);
  };

  const applyDrop = (fromTabId: string, toTabId?: string) => {
    if (!fromTabId) return;
    if (!tabs.some((tab) => tab.id === fromTabId)) {
      onAdopt(fromTabId);
      return;
    }
    if (toTabId && fromTabId !== toTabId) onMove(fromTabId, toTabId);
  };

  return (
    <div
      className="tab-strip"
      role="tablist"
      aria-label="메모 탭"
      onDragEnter={(event) => {
        if (!dragActive) return;
        event.preventDefault();
      }}
      onDragOver={(event) => {
        if (dragActive) event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        applyDrop(event.dataTransfer.getData("text/plain"));
        endDrag();
      }}
    >
      <div
        className={`tabs-scroll ${tabsOverflowing ? "is-overflowing" : ""}`}
        ref={tabsScrollRef}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            draggingTabId={draggingTabId}
            dragActive={dragActive}
            dropTarget={dropTargetId === tab.id}
            onSelect={onSelect}
            onClose={onClose}
            onToggleUrgent={onToggleUrgent}
            onDragStateChange={onDragStateChange}
            onDropTargetChange={(tabId) =>
              setDropTargetId((current) =>
                tabId === null && current !== tab.id ? current : tabId,
              )
            }
            onDrop={applyDrop}
            onDragEnd={endDrag}
          />
        ))}
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
    </div>
  );
}
