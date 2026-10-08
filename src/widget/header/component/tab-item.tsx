import { Bookmark, Pin, X } from "lucide-react";
import type { DragEvent } from "react";

import type { NoteTab } from "@/src/entity/notepad";

// Mobile opens the tab menu with a double tap instead of a right click.
const isTouchLayout = () =>
  window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;

type Props = {
  tab: NoteTab;
  active: boolean;
  draggingTabId: string | null;
  dragActive: boolean;
  dropTarget: boolean;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onCycleTabColor: (tabId: string) => void;
  onContextMenu: (tabId: string, clientX: number, clientY: number) => void;
  onDragStateChange: (tabId: string | null) => void;
  onDropTargetChange: (tabId: string | null) => void;
  onDrop: (fromTabId: string, toTabId: string) => void;
  onDragEnd: () => void;
};

export function TabItem({
  tab,
  active,
  draggingTabId,
  dragActive,
  dropTarget,
  onSelect,
  onClose,
  onCycleTabColor,
  onContextMenu,
  onDragStateChange,
  onDropTargetChange,
  onDrop,
  onDragEnd,
}: Props) {
  const dirty = tab.content.trim() !== "" && tab.content !== tab.savedContent;
  const markDropTarget = (event: DragEvent<HTMLDivElement>) => {
    if (!dragActive || draggingTabId === tab.id) return;
    event.preventDefault();
    onDropTargetChange(tab.id);
  };

  return (
    <div
      className={`tab-item ${active ? "is-active" : ""} ${dirty ? "is-dirty" : ""} ${
        draggingTabId === tab.id ? "is-dragging" : ""
      } ${dropTarget ? "is-drop-target" : ""} ${tab.pinned ? "is-pinned" : ""} ${
        tab.bookmarked ? "is-bookmarked" : ""
      }`}
      data-tab-color={tab.tabColor}
      draggable
      onContextMenu={(event) => {
        event.preventDefault();
        if (isTouchLayout()) return;
        onContextMenu(tab.id, event.clientX, event.clientY);
      }}
      onAuxClick={(event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        onClose(tab.id);
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", tab.id);
        onDragStateChange(tab.id);
      }}
      onDragOver={markDropTarget}
      onDragEnter={markDropTarget}
      onDragLeave={() => onDropTargetChange(null)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop(event.dataTransfer.getData("text/plain"), tab.id);
        onDragEnd();
      }}
      onDragEnd={onDragEnd}
    >
      <button
        className={`dirty-dot ${dirty ? "is-dirty" : ""}`}
        type="button"
        onClick={() => onCycleTabColor(tab.id)}
        aria-label={`${tab.title} 탭 색상 변경`}
        title="탭 색상 변경"
      />
      <button
        className="tab-select"
        type="button"
        role="tab"
        aria-label={tab.title}
        aria-selected={active}
        onClick={() => onSelect(tab.id)}
        onDoubleClick={(event) => {
          if (!isTouchLayout()) return;
          event.preventDefault();
          onContextMenu(tab.id, event.clientX, event.clientY);
        }}
      >
        {tab.pinned && (
          <span className="tab-pin-indicator" aria-label="고정됨" title="고정됨">
            <Pin className="tab-indicator is-pin" size={13} aria-hidden="true" />
          </span>
        )}
        {tab.bookmarked && (
          <span className="tab-bookmark-indicator" aria-hidden="true">
            <Bookmark
              className="tab-indicator is-bookmark"
              size={13}
              aria-hidden="true"
            />
          </span>
        )}
        <span className="tab-title">{tab.title}</span>
      </button>
      {!tab.pinned && (
        <button
          className="tab-close"
          type="button"
          onClick={() => onClose(tab.id)}
          aria-label={`${tab.title} 닫기`}
          title="탭 닫기"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
