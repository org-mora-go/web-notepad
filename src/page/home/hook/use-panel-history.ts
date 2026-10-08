"use client";

import { useEffect, useRef } from "react";

export function usePanelHistory(open: boolean, onClose: () => void) {
  const historyEntryActive = useRef(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" || event.isComposing || event.defaultPrevented ||
        document.querySelector("dialog[open]")
      ) return;
      event.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const handlePopState = () => {
      if (!historyEntryActive.current) return;
      historyEntryActive.current = false;
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onClose]);

  useEffect(() => {
    if (open && !historyEntryActive.current) {
      window.history.pushState(null, "", window.location.href);
      historyEntryActive.current = true;
    } else if (!open && historyEntryActive.current) {
      historyEntryActive.current = false;
      window.history.back();
    }
  }, [open]);
}
