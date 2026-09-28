"use client";

import type { RefObject } from "react";
import type { NoteTab } from "@/src/entity/notepad/store";
import { useNoteEditor } from "./hook";

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
  const {
    lineRailRef,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleScroll,
  } = useNoteEditor({ tab, composingRef, onChange });

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
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onScroll={handleScroll}
        placeholder="Take a note.."
        autoFocus={autoFocus}
        spellCheck={false}
        aria-label={`${tab.title} 메모 내용`}
      />
    </div>
  );
}
