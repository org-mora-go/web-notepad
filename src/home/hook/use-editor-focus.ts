"use client";

import { useEffect, type RefObject } from "react";
import { useNotepadStore } from "@/src/home/store";

export function useEditorFocus(
  editorRef: RefObject<HTMLTextAreaElement | null>,
  activeTabId: string,
  hydrated: boolean,
) {
  useEffect(() => {
    if (!hydrated) return;

    const frame = window.requestAnimationFrame(() => {
      const currentTab = useNotepadStore
        .getState()
        .tabs.find((tab) => tab.id === activeTabId);
      const editor = editorRef.current;
      if (!currentTab || !editor) return;

      editor.focus();
      editor.setSelectionRange(currentTab.content.length, currentTab.content.length);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTabId, editorRef, hydrated]);
}
