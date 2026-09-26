"use client";

import { useEffect, type RefObject } from "react";
import { useNotepadStore } from "@/src/home/store";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
};

export function useNotepadShortcuts({ editorRef, composingRef }: Options) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const state = useNotepadStore.getState();
      const { tabs, activeTabId } = state;
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
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
        if (!editor) return;
        event.preventDefault();
        const selectAll = () => {
          editor.focus();
          editor.setSelectionRange(0, editor.value.length);
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
        state.addTab();
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
        state.closeTab(activeTabId);
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey && event.key === "Tab") {
        event.preventDefault();
        state.addTab();
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
        if (tabs.length <= 1) {
          return;
        }

        event.preventDefault();
        const nextIndex = isArrowUp ? activeIndex - 1 : activeIndex + 1;
        if (nextIndex >= 0 && nextIndex < tabs.length) {
          state.selectTab(tabs[nextIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [composingRef, editorRef]);
}
