"use client";

import { Body, Header } from "@/src/widget";

import type { PaneViewProps } from "../type";
import { PaneDivider } from "./pane-divider";

export function PaneView({
  tabs,
  groups,
  activeGroupId,
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
  onMoveToGroup,
  onAdopt,
  onDragStateChange,
  onCycleTabColor,
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
            groups={groups}
            activeGroupId={activeGroupId}
            activeTabId={activeTab.id}
            tabsScrollRef={tabStrip.tabsScrollRef}
            tabsOverflowing={tabStrip.tabsOverflowing}
            tabsCanScrollLeft={tabStrip.tabsCanScrollLeft}
            tabsCanScrollRight={tabStrip.tabsCanScrollRight}
            draggingTabId={draggingTabId}
            onSelect={onSelect}
            onClose={onClose}
            onMove={onMove}
            onMoveToGroup={onMoveToGroup}
            onAdopt={onAdopt}
            onDragStateChange={onDragStateChange}
            onCycleTabColor={onCycleTabColor}
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
