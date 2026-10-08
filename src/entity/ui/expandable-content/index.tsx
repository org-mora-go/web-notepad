"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  content: ReactNode;
};

// Clamped note content with a "더보기/간소화" toggle shown only when it overflows.
export function ExpandableContent({ content }: Props) {
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

  return (
    <div className="expandable-content">
      <p
        ref={contentRef}
        className={`expandable-content-text ${expanded ? "is-expanded" : ""}`}
      >
        {content}
      </p>
      {(canExpand || expanded) && (
        <button
          className="expandable-content-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "간소화" : "더보기"}
        </button>
      )}
    </div>
  );
}
