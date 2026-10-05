"use client";

import { type RefObject, useEffect } from "react";

import { useNotepadStore } from "@/src/entity/notepad";

export function useEditorFocus(
  editorRef: RefObject<HTMLTextAreaElement | null>,
  activeGroupId: string,
  activeTabId: string,
  hydrated: boolean,
  active: boolean,
) {
  useEffect(() => {
    if (!hydrated || !active) return;

    const frame = window.requestAnimationFrame(() => {
      const currentTab = useNotepadStore
        .getState()
        .groups.find((group) => group.id === activeGroupId)
        ?.tabs.find((tab) => tab.id === activeTabId);
      const editor = editorRef.current;
      if (!currentTab || !editor) return;
      if (
        window.matchMedia("(pointer: coarse)").matches &&
        document.activeElement !== editor
      ) {
        return;
      }

      editor.focus();
      editor.setSelectionRange(
        currentTab.content.length,
        currentTab.content.length,
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [active, activeGroupId, activeTabId, editorRef, hydrated]);
}
