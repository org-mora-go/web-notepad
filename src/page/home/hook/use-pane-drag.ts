"use client";

import { useState } from "react";

import type { PaneDropZone } from "@/src/entity";

type Options = {
  rightIds: Set<string>;
  split: boolean;
  leftTabCount: number;
  moveTabToPane: (tabId: string, pane: "left" | "right") => void;
};

export function usePaneDrag({ rightIds, split, leftTabCount, moveTabToPane }: Options) {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const draggingPane = draggingTabId
    ? rightIds.has(draggingTabId)
      ? "right"
      : "left"
    : null;

  const dropTo = (pane: "left" | "right") => () => {
    if (draggingTabId) moveTabToPane(draggingTabId, pane);
    setDraggingTabId(null);
  };

  const adoptTo = (pane: "left" | "right") => (tabId: string) => {
    moveTabToPane(tabId, pane);
    setDraggingTabId(null);
  };

  const leftDropZones: PaneDropZone[] = [];
  if (draggingPane === "right") {
    leftDropZones.push({
      key: "adopt",
      label: "Move here",
      onDrop: dropTo("left"),
    });
  } else if (draggingPane === "left" && !split && leftTabCount > 1) {
    leftDropZones.push({
      key: "split",
      label: "Split right",
      half: true,
      onDrop: dropTo("right"),
    });
  }

  const rightDropZones: PaneDropZone[] =
    draggingPane === "left"
      ? [{ key: "adopt", label: "Move here", onDrop: dropTo("right") }]
      : [];

  return { draggingTabId, setDraggingTabId, adoptTo, leftDropZones, rightDropZones };
}