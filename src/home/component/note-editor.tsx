"use client";

import { useRef, type RefObject } from "react";
import type { NoteTab } from "@/src/home/store";

type Props = {
  tab: NoteTab;
  lineCount: number;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  onChange: (content: string) => void;
};

export function NoteEditor({
  tab,
  lineCount,
  editorRef,
  composingRef,
  autoFocus = false,
  onChange,
}: Props) {
  const lineRailRef = useRef<HTMLDivElement>(null);

  return (
    <div className="note-editor">
      <div className="line-rail" ref={lineRailRef} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, index) => (
          <span key={index}>{String(index + 1).padStart(2, "0")}</span>
        ))}
      </div>
      <textarea
        ref={editorRef}
        className="note-area"
        value={tab.content}
        onChange={(event) => onChange(event.target.value)}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={() => {
          composingRef.current = false;
        }}
        onScroll={(event) => {
          if (lineRailRef.current) {
            lineRailRef.current.scrollTop = event.currentTarget.scrollTop;
          }
        }}
        placeholder="Take a note.."
        autoFocus={autoFocus}
        spellCheck={false}
        aria-label={`${tab.title} 메모 내용`}
      />
    </div>
  );
}
