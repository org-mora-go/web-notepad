"use client";

import { type RefObject, useCallback, useState } from "react";

import { getActiveGroup, type NoteTab, useNotepadStore } from "@/src/entity/notepad";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  rightEditorRef: RefObject<HTMLTextAreaElement | null>;
  activeTabId: string;
  activeRightTabId: string | null;
  tabs: NoteTab[];
};

export function useHomeTabActions({
  editorRef,
  rightEditorRef,
  activeTabId,
  activeRightTabId,
  tabs,
}: Options) {
  const [pendingCloseTabId, setPendingCloseTabId] = useState<string | null>(null);

  const requestCloseTab = useCallback((tabId: string) => {
    const state = useNotepadStore.getState();
    const group = getActiveGroup(state);
    const tab = group?.tabs.find((item) => item.id === tabId);
    if (!group || !tab || tab.pinned) return;

    const editor = tabId === group.activeTabId
      ? editorRef.current
      : tabId === group.activeRightTabId
        ? rightEditorRef.current
        : null;
    const content = editor?.value ?? tab.content;
    if (content !== tab.content) state.updateTab(tabId, content);
    if (content.length > 0) {
      setPendingCloseTabId(tabId);
    } else {
      state.closeTab(tabId);
    }
  }, [editorRef, rightEditorRef]);

  const addTabToPane = (pane: "left" | "right") => {
    const state = useNotepadStore.getState();
    const group = getActiveGroup(state);
    if (!group) return;
    const tabId = pane === "right" ? group.activeRightTabId : group.activeTabId;
    const editor = pane === "right" ? rightEditorRef.current : editorRef.current;

    if (tabId && editor) state.updateTab(tabId, editor.value);
    state.addTab(pane);
  };

  const moveToGroup = (tabId: string, groupId: string) => {
    const state = useNotepadStore.getState();
    const editor = tabId === activeTabId
      ? editorRef.current
      : tabId === activeRightTabId ? rightEditorRef.current : null;
    if (editor && editor.value !== tabs.find((tab) => tab.id === tabId)?.content) {
      state.updateTab(tabId, editor.value);
    }
    state.moveTabToGroup(tabId, groupId);
  };

  return {
    pendingCloseTabId,
    requestCloseTab,
    addTabToPane,
    moveToGroup,
    cancelCloseTab: () => setPendingCloseTabId(null),
    confirmCloseTab: () => {
      if (pendingCloseTabId) useNotepadStore.getState().closeTab(pendingCloseTabId);
      setPendingCloseTabId(null);
    },
  };
}