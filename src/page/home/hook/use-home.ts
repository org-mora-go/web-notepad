"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PaneDropZone } from "@/src/entity";
import { useTabStrip } from "@/src/entity/hook";
import { useNotepadStore } from "@/src/entity/notepad";

import { useEditorFocus } from "./use-editor-focus";
import { useNotepadShortcuts } from "./use-notepad-shortcuts";
import { usePanelHistory } from "./use-panel-history";
import { useStoreHydrated } from "./use-store-hydrated";

export function useHome() {
  const hydrated = useStoreHydrated();
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const rightEditorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const rightComposingRef = useRef(false);
  const {
    groups,
    activeGroupId,
    selectGroup,
    selectTab,
    updateTab,
    moveTab,
    moveTabToPane,
    setActivePane,
    setSplitRatio,
    cycleTabColor,
    togglePin,
    toggleBookmark,
    closeTab,
    openBookmark,
    removeBookmark,
    createGroup,
    renameGroup,
    removeGroup,
  } = useNotepadStore();

  const activeGroup =
    groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const tabs = activeGroup?.tabs ?? [];
  const activeTabId = activeGroup?.activeTabId ?? "";
  const activeRightTabId = activeGroup?.activeRightTabId ?? null;
  const activePane = activeGroup?.activePane ?? "left";
  const splitRatio = activeGroup?.splitRatio ?? 0.5;
  const bookmarks = activeGroup?.bookmarks ?? [];
  const groupCount = groups.length;
  const activeGroupName = activeGroup?.name ?? "Ungrouped";
  const closeSidePanels = useCallback(() => {
    setBookmarksOpen(false);
    setGroupsOpen(false);
    setShortcutsOpen(false);
  }, []);

  usePanelHistory(
    bookmarksOpen || groupsOpen || shortcutsOpen,
    closeSidePanels,
  );

  const rightIds = useMemo(
    () => new Set(activeGroup?.rightTabIds ?? []),
    [activeGroup?.rightTabIds],
  );
  const leftTabs = tabs.filter((tab) => !rightIds.has(tab.id));
  const rightTabs = tabs.filter((tab) => rightIds.has(tab.id));
  const split = rightTabs.length > 0;
  const leftActiveTab =
    leftTabs.find((tab) => tab.id === activeTabId) ?? leftTabs[0];
  const activeRightTab =
    rightTabs.find((tab) => tab.id === activeRightTabId) ?? rightTabs[0];
  const activeTab =
    (activePane === "right"
      ? (activeRightTab ?? leftActiveTab)
      : (leftActiveTab ?? activeRightTab)) ?? rightTabs[0];

  useNotepadShortcuts({ editorRef, rightEditorRef, composingRef });
  useEditorFocus(
    editorRef,
    activeGroupId,
    activeTabId,
    hydrated,
    activePane !== "right",
  );
  useEditorFocus(
    rightEditorRef,
    activeGroupId,
    activeRightTabId ?? "",
    hydrated,
    activePane === "right",
  );

  // Keep the caret in the pane that shortcuts just moved to.
  useEffect(() => {
    if (!hydrated) return;
    const frame = window.requestAnimationFrame(() => {
      const target =
        activePane === "right" ? rightEditorRef.current : editorRef.current;
      target?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePane, hydrated]);

  const leftStrip = useTabStrip(leftTabs.length, activeTabId, hydrated);
  const rightStrip = useTabStrip(
    rightTabs.length,
    activeRightTabId ?? "",
    hydrated,
  );

  const addTabToPane = (pane: "left" | "right") => {
    const state = useNotepadStore.getState();
    const group = state.groups.find((item) => item.id === state.activeGroupId);
    if (!group) return;
    const tabId = pane === "right" ? group.activeRightTabId : group.activeTabId;
    const editor =
      pane === "right" ? rightEditorRef.current : editorRef.current;

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
    leftDropZones.push({
      key: "adopt",
      label: "Move here",
      onDrop: dropTo("left"),
    });
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

  const leftPaneProps = leftActiveTab
    ? {
        tabs: leftTabs,
        activeTab: leftActiveTab,
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
        onCycleTabColor: cycleTabColor,
        onTogglePin: togglePin,
        onToggleBookmark: toggleBookmark,
        onAdd: () => addTabToPane("left"),
        onChange: (content: string) => updateTab(leftActiveTab.id, content),
      }
    : null;

  const rightPaneProps =
    split && activeRightTab
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
          onCycleTabColor: cycleTabColor,
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
    groupsOpen,
    setGroupsOpen,
    shortcutsOpen,
    setShortcutsOpen,
    activeGroupId,
    selectGroup,
    activeTab,
    split,
    bookmarks,
    groups,
    groupCount,
    activeGroupName,
    leftPaneProps,
    rightPaneProps,
    openBookmark,
    removeBookmark,
    createGroup,
    renameGroup,
    removeGroup,
  };
}
