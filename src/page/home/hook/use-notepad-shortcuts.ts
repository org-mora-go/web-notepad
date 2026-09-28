"use client";

import { useEffect, type RefObject } from "react";
import { useNotepadStore } from "@/src/entity/notepad/store";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  rightEditorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
};

export function useNotepadShortcuts({ editorRef, rightEditorRef, composingRef }: Options) {
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
        const activeEditor = pane === "right" ? rightEditorRef.current : editorRef.current;
        if (activeEditor && paneActiveId) {
          state.updateTab(paneActiveId, activeEditor.value);
        }
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
        const activeEditor = pane === "right" ? rightEditorRef.current : editorRef.current;
        if (activeEditor && paneActiveId) {
          state.updateTab(paneActiveId, activeEditor.value);
        }
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
        event.preventDefault();
        const offset = isArrowUp ? -1 : 1;

        if (rightTabIds.length === 0) {
          const currentIndex = tabs.findIndex((tab) => tab.id === paneActiveId);
          const nextIndex = currentIndex + offset;
          if (currentIndex < 0 || nextIndex < 0 || nextIndex >= tabs.length) return;
          state.selectTab(tabs[nextIndex].id);
          return;
        }

        const leftTabs = tabs.filter((tab) => !rightTabIds.includes(tab.id));
        const rightTabs = paneRightTabs;
        if (pane === "left") {
          const currentIndex = leftTabs.findIndex((tab) => tab.id === paneActiveId);
          if (currentIndex < 0) return;

          if (isArrowUp && currentIndex > 0) {
            state.selectTab(leftTabs[currentIndex - 1].id);
          } else if (isArrowDown && currentIndex < leftTabs.length - 1) {
            state.selectTab(leftTabs[currentIndex + 1].id);
          } else if (isArrowDown && currentIndex === leftTabs.length - 1) {
            state.selectTab(rightTabs[0].id);
          }
          return;
        }

        const currentIndex = rightTabs.findIndex((tab) => tab.id === paneActiveId);
        if (currentIndex < 0) return;

        if (isArrowUp && currentIndex > 0) {
          state.selectTab(rightTabs[currentIndex - 1].id);
        } else if (isArrowUp && currentIndex === 0) {
          state.selectTab(leftTabs[leftTabs.length - 1].id);
        } else if (isArrowDown && currentIndex < rightTabs.length - 1) {
          state.selectTab(rightTabs[currentIndex + 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [composingRef, editorRef]);
}
