import { X } from "lucide-react";
import type { NoteTab } from "@/src/page/home/store";

type Props = {
  tab: NoteTab;
  active: boolean;
  draggingTabId: string | null;
  dragActive: boolean;
  dropTarget: boolean;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onToggleUrgent: (tabId: string) => void;
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
  onToggleUrgent,
  onDragStateChange,
  onDropTargetChange,
  onDrop,
  onDragEnd,
}: Props) {
  const dirty = tab.content.trim() !== "" && tab.content !== tab.savedContent;

  return (
    <div
      className={`tab-item ${active ? "is-active" : ""} ${dirty ? "is-dirty" : ""} ${
        tab.urgent ? "is-urgent" : ""
      } ${draggingTabId === tab.id ? "is-dragging" : ""} ${
        dropTarget ? "is-drop-target" : ""
      }`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", tab.id);
        onDragStateChange(tab.id);
      }}
      onDragOver={(event) => {
        if (!dragActive || draggingTabId === tab.id) return;
        event.preventDefault();
        onDropTargetChange(tab.id);
      }}
      onDragEnter={(event) => {
        if (!dragActive || draggingTabId === tab.id) return;
        event.preventDefault();
        onDropTargetChange(tab.id);
      }}
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
        className={`dirty-dot ${dirty ? "is-dirty" : ""} ${tab.urgent ? "is-urgent" : ""}`}
        type="button"
        onClick={() => onToggleUrgent(tab.id)}
        aria-pressed={tab.urgent}
        aria-label={`${tab.title} 긴급 표시`}
        title="긴급 표시"
      />
      <button
        className="tab-select"
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => onSelect(tab.id)}
      >
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
}
