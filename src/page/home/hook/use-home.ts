"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTabStrip } from "@/src/entity/hook";
import { getActiveGroup, useNotepadStore } from "@/src/entity/notepad";

import { useEditorFocus } from "./use-editor-focus";
import { useHomeTabActions } from "./use-home-tab-actions";
import { useNotepadShortcuts } from "./use-notepad-shortcuts";
import { usePaneDrag } from "./use-pane-drag";
import { usePanelHistory } from "./use-panel-history";
import { useStoreHydrated } from "./use-store-hydrated";

type SidePanel = "closed" | "bookmarks" | "groups" | "shortcuts" | "global-search";

export function useHome() {
  const hydrated = useStoreHydrated();
  const [openPanel, setOpenPanel] = useState<SidePanel | null>(null);
  const [closedSearchQuery, setClosedSearchQuery] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const rightEditorRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);
  const rightComposingRef = useRef(false);
  const store = useNotepadStore();
  const {
    groups,
    activeGroupId,
    closedTabs,
    restoreClosedTab,
    removeClosedTab,
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
    openBookmark,
    removeBookmark,
    createGroup,
    renameGroup,
    removeGroup,
  } = store;

  const activeGroup = getActiveGroup(store);
  const tabs = activeGroup?.tabs ?? [];
  const activeTabId = activeGroup?.activeTabId ?? "";
  const activeRightTabId = activeGroup?.activeRightTabId ?? null;
  const activePane = activeGroup?.activePane ?? "left";
  const splitRatio = activeGroup?.splitRatio ?? 0.5;
  const bookmarks = activeGroup?.bookmarks ?? [];
  const groupCount = groups.length;
  const activeGroupName = activeGroup?.name ?? "Ungrouped";
  const closeSidePanels = useCallback(() => setOpenPanel(null), []);
  const toggleSidePanel = (panel: SidePanel) =>
    setOpenPanel((current) => (current === panel ? null : panel));

  usePanelHistory(openPanel !== null, closeSidePanels);

  const rightIds = new Set(activeGroup?.rightTabIds ?? []);
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

  const {
    pendingCloseTabId,
    requestCloseTab,
    addTabToPane,
    moveToGroup,
    cancelCloseTab,
    confirmCloseTab,
  } = useHomeTabActions({ editorRef, rightEditorRef, activeTabId, activeRightTabId, tabs });

  useNotepadShortcuts({ editorRef, rightEditorRef, composingRef, requestCloseTab });
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

  const { draggingTabId, setDraggingTabId, adoptTo, leftDropZones, rightDropZones } =
    usePaneDrag({ rightIds, split, leftTabCount: leftTabs.length, moveTabToPane });

  const sharedPaneProps = {
    groups,
    activeGroupId,
    draggingTabId,
    onSelect: selectTab,
    onClose: requestCloseTab,
    onMove: moveTab,
    onMoveToGroup: moveToGroup,
    onDragStateChange: setDraggingTabId,
    onCycleTabColor: cycleTabColor,
    onTogglePin: togglePin,
    onToggleBookmark: toggleBookmark,
  };

  const leftPaneProps = leftActiveTab
    ? {
        ...sharedPaneProps,
        tabs: leftTabs,
        activeTab: leftActiveTab,
        tabStrip: leftStrip,
        editorRef,
        composingRef,
        autoFocus: true,
        isFocused: !split || activePane === "left",
        dropZones: leftDropZones,
        widthRatio: split ? splitRatio : undefined,
        onActivate: () => setActivePane("left"),
        onAdopt: adoptTo("left"),
        onAdd: () => addTabToPane("left"),
        onChange: (content: string) => updateTab(leftActiveTab.id, content),
      }
    : null;

  const rightPaneProps =
    split && activeRightTab
      ? {
          ...sharedPaneProps,
          tabs: rightTabs,
          activeTab: activeRightTab,
          tabStrip: rightStrip,
          editorRef: rightEditorRef,
          composingRef: rightComposingRef,
          isFocused: activePane === "right",
          dropZones: rightDropZones,
          onResize: setSplitRatio,
          onActivate: () => setActivePane("right"),
          onAdopt: adoptTo("right"),
          onAdd: () => addTabToPane("right"),
          onChange: (content: string) => updateTab(activeRightTab.id, content),
        }
      : null;

  return {
    hydrated,
    closedTabs,
    restoreClosedTab,
    removeClosedTab,
    pendingCloseTabId,
    cancelCloseTab,
    confirmCloseTab,
    openPanel,
    closedSearchQuery,
    setClosedSearchQuery,
    toggleSidePanel,
    closeSidePanels,
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
