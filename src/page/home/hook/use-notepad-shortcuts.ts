"use client";

import { useEffect, type RefObject } from "react";
import { useNotepadStore } from "@/src/page/home/store";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
};

export function useNotepadShortcuts({ editorRef, composingRef }: Options) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const state = useNotepadStore.getState();
      const { tabs, rightTabIds } = state;
      const pane = rightTabIds.length === 0 ? "left" : state.activePane;
      const paneRightTabs = tabs.filter((tab) => rightTabIds.includes(tab.id));
      const paneActiveId =
        pane === "right" ? (state.activeRightTabId ?? "") : state.activeTabId;
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

      if (
        (event.metaKey || event.altKey) &&
        !event.ctrlKey &&
        (event.key.toLowerCase() === "a" || event.code === "KeyA")
      ) {
        const active = document.activeElement;
        const target = active instanceof HTMLTextAreaElement ? active : editor;
        if (!target) return;
        event.preventDefault();
        const selectAll = () => {
          target.focus();
          target.setSelectionRange(0, target.value.length);
        };
        selectAll();
        window.requestAnimationFrame(selectAll);
        window.setTimeout(selectAll, 50);
        return;
      }

      const shouldAddTab =
        (event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "n") ||
        (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "n");

      if (shouldAddTab) {
        event.preventDefault();
        state.addTab(pane);
        return;
      }

      const shouldCloseTab =
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        (event.key.toLowerCase() === "w" ||
          event.key === "Backspace" ||
          event.code === "Backspace");

      if (shouldCloseTab) {
        event.preventDefault();
        state.closeTab(paneActiveId);
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey && event.key === "Tab") {
        event.preventDefault();
        state.addTab(pane);
        return;
      }

      const isArrowUp =
        event.key === "ArrowUp" || event.key === "Up" || event.code === "ArrowUp";
      const isArrowDown =
        event.key === "ArrowDown" || event.key === "Down" || event.code === "ArrowDown";

      if (
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        (isArrowUp || isArrowDown)
      ) {
        // Tab navigation spans both panes, ordered left pane first.
        const orderedTabs =
          rightTabIds.length === 0
            ? tabs
            : [...tabs.filter((tab) => !rightTabIds.includes(tab.id)), ...paneRightTabs];
        const orderedIndex = orderedTabs.findIndex((tab) => tab.id === paneActiveId);

        event.preventDefault();
        const offset = isArrowUp ? -1 : 1;
        const nextIndex = orderedIndex + offset;
        if (orderedIndex < 0 || nextIndex < 0 || nextIndex >= orderedTabs.length) return;
        state.selectTab(orderedTabs[nextIndex].id);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [composingRef, editorRef]);
}
