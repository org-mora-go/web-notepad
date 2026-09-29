"use client";

import { type DragEvent as ReactDragEvent,useEffect, useState } from "react";

export function usePaneDropArea(dragActive: boolean, onDrop: () => void) {
  const [dropAreaHovered, setDropAreaHovered] = useState(false);

  useEffect(() => {
    if (!dragActive) setDropAreaHovered(false);
  }, [dragActive]);

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
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
