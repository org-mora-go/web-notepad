"use client";

import { type RefObject, useEffect } from "react";

type Options = {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  rightEditorRef: RefObject<HTMLTextAreaElement | null>;
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
          const selectInputAll = () => {
            if (document.activeElement !== active) return;
            active.setSelectionRange(0, active.value.length);
          };
          selectInputAll();
          window.requestAnimationFrame(selectInputAll);
          window.setTimeout(selectInputAll, 50);
        }
        return;
      }

      const target = isEditorTarget
        ? (active as HTMLTextAreaElement)
        : editorRef.current;
      if (!target) return;

      event.preventDefault();
      const selectAll = () => {
        if (document.activeElement !== target) return;
        target.setSelectionRange(0, target.value.length);
      };
      target.focus();
      selectAll();
      window.requestAnimationFrame(selectAll);
      window.setTimeout(selectAll, 50);
    };

    window.addEventListener("keydown", handleSelectAll);
    return () => window.removeEventListener("keydown", handleSelectAll);
  }, [editorRef, rightEditorRef]);
}
