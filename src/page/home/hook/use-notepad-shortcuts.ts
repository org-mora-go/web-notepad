"use client";

import { type RefObject, useEffect } from "react";

import { isAltBackspace } from "@/src/entity";
import { getActiveGroup, useNotepadStore } from "@/src/entity/notepad";

import { useSelectAllShortcut } from "./use-select-all-shortcut";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  rightEditorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  requestCloseTab: (tabId: string) => void;
  onSelectTab: (tabId: string) => void;
  onAddTab: (pane: "left" | "right") => void;
  onMoveTabToPane: (tabId: string, pane: "left" | "right") => void;
};

const matchesKey = (event: KeyboardEvent, ...names: string[]) =>
  names.includes(event.key) || names.includes(event.code);

export function useNotepadShortcuts({
  editorRef,
  rightEditorRef,
  composingRef,
  requestCloseTab,
  onSelectTab,
  onAddTab,
  onMoveTabToPane,
}: Options) {
  useSelectAllShortcut({ editorRef, rightEditorRef });

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const state = useNotepadStore.getState();
      const activeGroup = getActiveGroup(state);
      if (!activeGroup) return;
      const { tabs, rightTabIds } = activeGroup;
      const pane = rightTabIds.length === 0 ? "left" : activeGroup.activePane;
      const paneActiveId =
        pane === "right"
          ? (activeGroup.activeRightTabId ?? "")
          : activeGroup.activeTabId;
      const editorOf = (target: "left" | "right") =>
        target === "right" ? rightEditorRef.current : editorRef.current;
      const flushActiveEditor = () => {
        const activeEditor = editorOf(pane);
        if (activeEditor && paneActiveId) {
          state.updateTab(paneActiveId, activeEditor.value);
        }
      };
      const editor = editorRef.current;

      // The Korean IME swallows the first shortcut key while composing, so commit as soon as a modifier is held.
      if (
        composingRef.current &&
        (event.metaKey || event.altKey) &&
        editor &&
        document.activeElement === editor
      ) {
        composingRef.current = false;
        editor.blur();
        editor.focus();
      }

      if (isAltBackspace(event)) {
        event.preventDefault();
        if (!event.repeat) requestCloseTab(paneActiveId);
        return;
      }

      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "Tab") {
        event.preventDefault();
        flushActiveEditor();
        onAddTab(pane);
        return;
      }

      if (event.shiftKey) return;

      const isF12 = matchesKey(event, "F12");
      if (isF12 || matchesKey(event, "F11")) {
        event.preventDefault();
        const targetPane = isF12 ? "right" : "left";
        if (pane === targetPane || !paneActiveId) return;

        flushActiveEditor();
        onMoveTabToPane(paneActiveId, targetPane);
        const targetEditor = editorOf(targetPane);
        window.requestAnimationFrame(() => targetEditor?.focus());
        return;
      }

      const isArrowUp = matchesKey(event, "ArrowUp", "Up");
      if (isArrowUp || matchesKey(event, "ArrowDown", "Down")) {
        event.preventDefault();
        // Navigation runs through the left pane and then continues into the right pane.
        const orderedTabs = [
          ...tabs.filter((tab) => !rightTabIds.includes(tab.id)),
          ...tabs.filter((tab) => rightTabIds.includes(tab.id)),
        ];
        const currentIndex = orderedTabs.findIndex((tab) => tab.id === paneActiveId);
        const nextTab = orderedTabs[currentIndex + (isArrowUp ? -1 : 1)];
        if (currentIndex >= 0 && nextTab) onSelectTab(nextTab.id);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [
    composingRef,
    editorRef,
    onAddTab,
    onMoveTabToPane,
    onSelectTab,
    requestCloseTab,
    rightEditorRef,
  ]);
}
