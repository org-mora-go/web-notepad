"use client";

import { type PointerEvent as ReactPointerEvent, useCallback } from "react";

export function usePaneResize(onResize?: (ratio: number) => void) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!onResize) return;
      event.preventDefault();
      const group = event.currentTarget.parentElement;
      if (!group) return;

      const handleMove = (moveEvent: PointerEvent) => {
        const rect = group.getBoundingClientRect();
        onResize((moveEvent.clientX - rect.left) / rect.width);
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [onResize],
  );
}
