"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PaneDropZone } from "@/src/entity";
import { useTabStrip } from "@/src/entity/hook";
import { useNotepadStore } from "@/src/entity/store";
import { useEditorFocus } from "./use-editor-focus";
import { useNotepadShortcuts } from "./use-notepad-shortcuts";
import { useStoreHydrated } from "./use-store-hydrated";

export function useHome() {
  const hydrated = useStoreHydrated();
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const rightEditorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const rightComposingRef = useRef(false);
  const {
    tabs,
    activeTabId,
    rightTabIds,
    activeRightTabId,
    activePane,
    splitRatio,
    bookmarks,
    selectTab,
    updateTab,
    moveTab,
    moveTabToPane,
    setActivePane,
    setSplitRatio,
    toggleUrgent,
    togglePin,
    toggleBookmark,
    closeTab,
    openBookmark,
    removeBookmark,
  } = useNotepadStore();

  const rightIds = useMemo(() => new Set(rightTabIds), [rightTabIds]);
  const leftTabs = tabs.filter((tab) => !rightIds.has(tab.id));
  const rightTabs = tabs.filter((tab) => rightIds.has(tab.id));
  const split = rightTabs.length > 0;
  const activeTab = leftTabs.find((tab) => tab.id === activeTabId) ?? leftTabs[0];
  const activeRightTab =
    rightTabs.find((tab) => tab.id === activeRightTabId) ?? rightTabs[0];
  const lineCount = activeTab?.content.split("\n").length ?? 1;

  useNotepadShortcuts({ editorRef, rightEditorRef, composingRef });
  useEditorFocus(editorRef, activeTabId, hydrated);
  useEditorFocus(rightEditorRef, activeRightTabId ?? "", hydrated);

  // Keep the caret in the pane that shortcuts just moved to.
  useEffect(() => {
    if (!hydrated) return;
    const frame = window.requestAnimationFrame(() => {
      const target = activePane === "right" ? rightEditorRef.current : editorRef.current;
      target?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePane, hydrated]);

  const leftStrip = useTabStrip(leftTabs.length, activeTabId, hydrated);
  const rightStrip = useTabStrip(rightTabs.length, activeRightTabId ?? "", hydrated);

  const addTabToPane = (pane: "left" | "right") => {
    const state = useNotepadStore.getState();
    const tabId = pane === "right" ? state.activeRightTabId : state.activeTabId;
    const editor = pane === "right" ? rightEditorRef.current : editorRef.current;

    // Commit the textarea's latest value before changing the active tab.
    if (tabId && editor) state.updateTab(tabId, editor.value);
    state.addTab(pane);
  };

  const draggingPane = draggingTabId
    ? rightIds.has(draggingTabId)
      ? "right"
      : "left"
    : null;

  const dropTo = (pane: "left" | "right") => () => {
    if (draggingTabId) moveTabToPane(draggingTabId, pane);
    setDraggingTabId(null);
  };

  // The source pane can unmount on drop, so its dragend never fires.
  const adoptTo = (pane: "left" | "right") => (tabId: string) => {
    moveTabToPane(tabId, pane);
    setDraggingTabId(null);
  };

  const leftDropZones: PaneDropZone[] = [];
  if (draggingPane === "right") {
    leftDropZones.push({ key: "adopt", label: "Move here", onDrop: dropTo("left") });
  } else if (draggingPane === "left" && !split && leftTabs.length > 1) {
    leftDropZones.push({
      key: "split",
      label: "Split right",
      half: true,
      onDrop: dropTo("right"),
    });
  }

  const rightDropZones: PaneDropZone[] =
    draggingPane === "left"
      ? [{ key: "adopt", label: "Move here", onDrop: dropTo("right") }]
      : [];

  const leftPaneProps = activeTab
    ? {
        tabs: leftTabs,
        activeTab,
        tabStrip: leftStrip,
        editorRef,
        composingRef,
        autoFocus: true,
        isFocused: !split || activePane === "left",
        draggingTabId,
        dropZones: leftDropZones,
        widthRatio: split ? splitRatio : undefined,
        onActivate: () => setActivePane("left"),
        onSelect: selectTab,
        onClose: closeTab,
        onMove: moveTab,
        onAdopt: adoptTo("left"),
        onDragStateChange: setDraggingTabId,
        onToggleUrgent: toggleUrgent,
        onTogglePin: togglePin,
        onToggleBookmark: toggleBookmark,
        onAdd: () => addTabToPane("left"),
        onChange: (content: string) => updateTab(activeTab.id, content),
      }
    : null;

  const rightPaneProps = split && activeRightTab
    ? {
        tabs: rightTabs,
        activeTab: activeRightTab,
        tabStrip: rightStrip,
        editorRef: rightEditorRef,
        composingRef: rightComposingRef,
        isFocused: activePane === "right",
        draggingTabId,
        dropZones: rightDropZones,
        onResize: setSplitRatio,
        onActivate: () => setActivePane("right"),
        onSelect: selectTab,
        onClose: closeTab,
        onMove: moveTab,
        onAdopt: adoptTo("right"),
        onDragStateChange: setDraggingTabId,
        onToggleUrgent: toggleUrgent,
        onTogglePin: togglePin,
        onToggleBookmark: toggleBookmark,
        onAdd: () => addTabToPane("right"),
        onChange: (content: string) => updateTab(activeRightTab.id, content),
      }
    : null;

  return {
    hydrated,
    bookmarksOpen,
    setBookmarksOpen,
    activeTab,
    lineCount,
    split,
    bookmarks,
    leftPaneProps,
    rightPaneProps,
    openBookmark,
    removeBookmark,
  };
}
