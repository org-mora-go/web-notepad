"use client";

import { useEffect, useRef, useState } from "react";

// Tracks whether clamped content overflows so a "더보기/간소화" toggle can expand it.
export function useExpandableContent(content: string) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const observer = new ResizeObserver(() => {
      if (!expanded) {
        setCanExpand(contentElement.scrollHeight > contentElement.clientHeight);
      }
    });
    observer.observe(contentElement);

    return () => observer.disconnect();
  }, [content, expanded]);

  return {
    contentRef,
    expanded,
    canExpand,
    toggleExpanded: () => setExpanded((current) => !current),
  };
}
