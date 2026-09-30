"use client";

import { Body, Header, PaneDivider } from "@/src/widget";

import type { PaneViewProps } from "../type";

export function PaneView({
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
  onTogglePin,
  onToggleBookmark,
  onAdd,
  onChange,
}: PaneViewProps) {
  return (
    <>
      {onResize && <PaneDivider onResize={onResize} />}
      <div
        className="pane-slot"
        style={widthRatio ? { flex: `0 0 ${widthRatio * 100}%` } : undefined}
      >
        <div
          className={`note-pane ${isFocused ? "" : "is-unfocused"}`}
          onFocusCapture={onActivate}
          onPointerDownCapture={onActivate}
        >
          <Header
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
            onTogglePin={onTogglePin}
            onToggleBookmark={onToggleBookmark}
            onAdd={onAdd}
          />
          <Body
            activeTab={activeTab}
            editorRef={editorRef}
            composingRef={composingRef}
            autoFocus={autoFocus}
            draggingTabId={draggingTabId}
            dropZones={dropZones}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}
