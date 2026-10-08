"use client";

import { type RefObject, useEffect } from "react";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  rightEditorRef: RefObject<HTMLTextAreaElement | null>;
};

// Browsers may reset the selection after keydown, so select again on the next frame and shortly after.
const selectAllPersistently = (target: HTMLInputElement | HTMLTextAreaElement) => {
  const selectAll = () => {
    if (document.activeElement !== target) return;
    target.setSelectionRange(0, target.value.length);
  };
  selectAll();
  window.requestAnimationFrame(selectAll);
  window.setTimeout(selectAll, 50);
};

export function useSelectAllShortcut({ editorRef, rightEditorRef }: Options) {
  useEffect(() => {
    const handleSelectAll = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.altKey) ||
        event.ctrlKey ||
        (event.key.toLowerCase() !== "a" && event.code !== "KeyA")
      ) {
        return;
      }

      const active = document.activeElement;
      const isEditorTarget =
        active === editorRef.current || active === rightEditorRef.current;
      const isEditableTarget =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable);

      if (isEditableTarget && !isEditorTarget) {
        if (
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLInputElement &&
            ["text", "search", "tel", "url", "password"].includes(
              active.type,
            ))
        ) {
          event.preventDefault();
          selectAllPersistently(active);
        }
        return;
      }

      const target = isEditorTarget
        ? (active as HTMLTextAreaElement)
        : editorRef.current;
      if (!target) return;

      event.preventDefault();
      target.focus();
      selectAllPersistently(target);
    };

    window.addEventListener("keydown", handleSelectAll);
    return () => window.removeEventListener("keydown", handleSelectAll);
  }, [editorRef, rightEditorRef]);
}
