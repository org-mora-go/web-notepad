"use client";

import type { RefObject } from "react";
import type { PaneDropZone } from "@/src/entity";
import type { TabStripState } from "@/src/page/home/hook";
import type { NoteTab } from "@/src/page/home/store";
import { NoteEditor } from "@/src/feature";
import { TabStrip } from "./component";
import { usePaneDropArea, usePaneResize } from "./hook";

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
  const adoptZone = dropZones.find((zone) => zone.key === "adopt");
  const {
    dropAreaHovered,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = usePaneDropArea(dragActive, () => adoptZone?.onDrop());
  const handleDividerPointerDown = usePaneResize(onResize);

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
            tabsOverflowing={tabStrip.tabsOverflowing}
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
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
