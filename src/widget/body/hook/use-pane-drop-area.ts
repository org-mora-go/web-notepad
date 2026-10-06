"use client";

import { type DragEvent as ReactDragEvent, useState } from "react";

export function usePaneDropArea(dragActive: boolean, onDrop: () => void) {
  const [dropAreaHovered, setDropAreaHovered] = useState(false);

  const handleDragEnter = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragActive) return;
    event.preventDefault();
    setDropAreaHovered(true);
  };

  const handleDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setDropAreaHovered(false);
  };

  const handleDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    if (dragActive) event.preventDefault();
  };

  const handleDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragActive) return;
    event.preventDefault();
    setDropAreaHovered(false);
    onDrop();
  };

  return {
    dropAreaHovered,
    clearDropAreaHovered: () => setDropAreaHovered(false),
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
