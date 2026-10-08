"use client";

import { useCallback, useEffect, useState } from "react";

import { getActiveGroup, useNotepadStore } from "@/src/entity/notepad";

import { useViewHistory,type ViewPanel, type ViewSnapshot } from "./use-view-history";

type Options = {
  hydrated: boolean;
  addTabToPane: (pane: "left" | "right") => void;
};

export function useHomeNavigation({ hydrated, addTabToPane }: Options) {
  const [openPanel, setOpenPanel] = useState<ViewPanel | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const getCurrentView = useCallback((panel: ViewPanel | null = openPanel): ViewSnapshot => {
    const group = getActiveGroup(useNotepadStore.getState());
    return {
      groupId: group?.id ?? "",
      leftTabId: group?.activeTabId ?? "",
      rightTabId: group?.activeRightTabId ?? null,
      pane: group?.activePane === "right" && group.activeRightTabId ? "right" : "left",
      panel,
    };
  }, [openPanel]);

  const restoreView = useCallback((snapshot: ViewSnapshot) => {
    const state = useNotepadStore.getState();
    const targetGroup =
      state.groups.find((group) => group.id === snapshot.groupId) ?? state.groups[0];
    if (!targetGroup) return;

    state.selectGroup(targetGroup.id);
    const leftTab = targetGroup.tabs.find(
      (tab) => tab.id === snapshot.leftTabId && !targetGroup.rightTabIds.includes(tab.id),
    ) ?? targetGroup.tabs.find((tab) => !targetGroup.rightTabIds.includes(tab.id));
    if (leftTab) state.selectTab(leftTab.id);

    const currentGroup = useNotepadStore.getState().groups.find(
      (group) => group.id === targetGroup.id,
    );
    const rightTab = currentGroup?.tabs.find(
      (tab) => tab.id === snapshot.rightTabId && currentGroup.rightTabIds.includes(tab.id),
    ) ?? currentGroup?.tabs.find((tab) => currentGroup.rightTabIds.includes(tab.id));
    if (rightTab) state.selectTab(rightTab.id);
    state.setActivePane(snapshot.pane === "right" && rightTab ? "right" : "left");
    setOpenPanel(snapshot.panel);
  }, []);

  const { pushView } = useViewHistory(
    hydrated,
    getCurrentView(null),
    restoreView,
  );

  const closeSidePanels = useCallback(() => {
    if (openPanel === null) return;
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, openPanel, pushView]);

  const toggleSidePanel = useCallback((panel: ViewPanel) => {
    if (openPanel === panel) {
      closeSidePanels();
      return;
    }
    setOpenPanel(panel);
    pushView(getCurrentView(panel));
  }, [closeSidePanels, getCurrentView, openPanel, pushView]);

  const selectTabWithHistory = useCallback((tabId: string) => {
    useNotepadStore.getState().selectTab(tabId);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  const activatePaneWithHistory = useCallback((pane: "left" | "right") => {
    const state = useNotepadStore.getState();
    const group = getActiveGroup(state);
    if (!group || group.activePane === pane) return;
    state.setActivePane(pane);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  const selectGroupAndClosePanel = useCallback((groupId: string) => {
    useNotepadStore.getState().selectGroup(groupId);
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, pushView]);

  const openBookmarkAndClosePanel = useCallback((groupId: string, bookmarkId: string) => {
    const state = useNotepadStore.getState();
    state.selectGroup(groupId);
    state.openBookmark(bookmarkId);
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, pushView]);

  const openBookmarkInCurrentGroupAndClosePanel = useCallback((bookmarkId: string) => {
    const state = useNotepadStore.getState();
    openBookmarkAndClosePanel(state.activeGroupId, bookmarkId);
  }, [openBookmarkAndClosePanel]);

  const restoreClosedTabAndClosePanel = useCallback((entryId: string) => {
    useNotepadStore.getState().restoreClosedTab(entryId);
    setOpenPanel(null);
    pushView(getCurrentView(null));
  }, [getCurrentView, pushView]);

  const addTabAndRecord = useCallback((pane: "left" | "right") => {
    addTabToPane(pane);
    pushView(getCurrentView());
  }, [addTabToPane, getCurrentView, pushView]);

  const moveTabToPaneAndRecord = useCallback((tabId: string, pane: "left" | "right") => {
    useNotepadStore.getState().moveTabToPane(tabId, pane);
    pushView(getCurrentView());
  }, [getCurrentView, pushView]);

  useEffect(() => {
    if (openPanel === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" || event.isComposing || event.defaultPrevented ||
        document.querySelector("dialog[open]")
      ) return;
      event.preventDefault();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      if (openPanel === "global-search") setGlobalSearchQuery("");
      closeSidePanels();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidePanels, openPanel]);

  return {
    openPanel,
    globalSearchQuery,
    setGlobalSearchQuery,
    closeSidePanels,
    toggleSidePanel,
    selectTabWithHistory,
    activatePaneWithHistory,
    selectGroupAndClosePanel,
    openBookmarkAndClosePanel,
    openBookmarkInCurrentGroupAndClosePanel,
    restoreClosedTabAndClosePanel,
    addTabAndRecord,
    moveTabToPaneAndRecord,
  };
}