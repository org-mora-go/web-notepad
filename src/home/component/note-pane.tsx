"use client";

import {
  useEffect,
  useState,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type { TabStripState } from "@/src/home/hook";
import type { NoteTab } from "@/src/home/store";
import { NoteEditor } from "./note-editor";
import { TabStrip } from "./tab-strip";

export type PaneDropZone = {
  key: string;
  label: string;
  half?: boolean;
  onDrop: () => void;
};

type Props = {
  tabs: NoteTab[];
  activeTab: NoteTab;
  tabStrip: TabStripState;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  isFocused: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  widthRatio?: number;
  onResize?: (ratio: number) => void;
  onActivate: () => void;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onMove: (fromTabId: string, toTabId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStateChange: (tabId: string | null) => void;
  onToggleUrgent: (tabId: string) => void;
  onAdd: () => void;
  onChange: (content: string) => void;
};

export function NotePane({
  tabs,
  activeTab,
  tabStrip,
  editorRef,
  composingRef,
  autoFocus,
  isFocused,
  draggingTabId,
  dropZones,
  widthRatio,
  onResize,
  onActivate,
  onSelect,
  onClose,
  onMove,
  onAdopt,
  onDragStateChange,
  onToggleUrgent,
  onAdd,
  onChange,
}: Props) {
  const dragActive = draggingTabId !== null;
  const [dropAreaHovered, setDropAreaHovered] = useState(false);

  useEffect(() => {
    if (!dragActive) setDropAreaHovered(false);
  }, [dragActive]);

  const handleDropAreaLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setDropAreaHovered(false);
  };

  const handleDividerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!onResize) return;
    event.preventDefault();
    const group = event.currentTarget.parentElement;
    if (!group) return;

    const handleMove = (moveEvent: PointerEvent) => {
      const rect = group.getBoundingClientRect();
      onResize((moveEvent.clientX - rect.left) / rect.width);
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <>
      {onResize && (
        <div
          className="pane-divider"
          role="separator"
          aria-orientation="vertical"
          aria-label="영역 크기 조절"
          onPointerDown={handleDividerPointerDown}
        />
      )}
      <div
        className="pane-slot"
        style={widthRatio ? { flex: `0 0 ${widthRatio * 100}%` } : undefined}
      >
        <div
          className={`note-pane ${isFocused ? "" : "is-unfocused"}`}
          onFocusCapture={onActivate}
          onPointerDownCapture={onActivate}
        >
          <TabStrip
            tabs={tabs}
            activeTabId={activeTab.id}
            tabsScrollRef={tabStrip.tabsScrollRef}
            tabListRef={tabStrip.tabListRef}
            tabsOverflowing={tabStrip.tabsOverflowing}
            tabListOpen={tabStrip.tabListOpen}
            setTabListOpen={tabStrip.setTabListOpen}
            draggingTabId={draggingTabId}
            onSelect={onSelect}
            onClose={onClose}
            onMove={onMove}
            onAdopt={onAdopt}
            onDragStateChange={onDragStateChange}
            onToggleUrgent={onToggleUrgent}
            onAdd={onAdd}
          />

          <div
            className="note-pane-body"
            onDragEnter={(event) => {
              if (!dragActive) return;
              event.preventDefault();
              setDropAreaHovered(true);
            }}
            onDragLeave={handleDropAreaLeave}
            onDragOver={(event) => {
              if (!dragActive) return;
              event.preventDefault();
            }}
            onDrop={(event) => {
              if (!dragActive) return;
              event.preventDefault();
              setDropAreaHovered(false);
              const zone = dropZones.find((item) => item.key === "adopt");
              zone?.onDrop();
            }}
          >
            <NoteEditor
              tab={activeTab}
              lineCount={activeTab.content.split("\n").length}
              editorRef={editorRef}
              composingRef={composingRef}
              autoFocus={autoFocus}
              onChange={onChange}
            />

            {dragActive && dropAreaHovered &&
              dropZones.map((zone) => (
                <div
                  key={zone.key}
                  className={`note-pane-drop ${zone.half ? "is-half" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setDropAreaHovered(false);
                    zone.onDrop();
                  }}
                >
                  <span>{zone.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
