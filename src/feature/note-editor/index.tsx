"use client";

import type { CSSProperties, RefObject } from "react";
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
    selectedLines,
    toggleLineSelection,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleScroll,
  } = useNoteEditor({ tab, composingRef, onChange });
  const selectedLineRanges: { start: number; end: number }[] = [];
  for (const line of [...selectedLines].sort((a, b) => a - b)) {
    const lastRange = selectedLineRanges.at(-1);
    if (lastRange && line === lastRange.end + 1) {
      lastRange.end = line;
    } else {
      selectedLineRanges.push({ start: line, end: line });
    }
  }

  return (
    <div className={`note-editor ${selectedLines.length > 0 ? "has-selected-line" : ""}`}>
      <div className="line-rail" ref={lineRailRef} aria-label="라인 번호">
        {Array.from({ length: lineCount }, (_, index) => (
          <span
            key={index}
            className={selectedLines.includes(index) ? "is-selected" : ""}
            role="button"
            tabIndex={0}
            aria-pressed={selectedLines.includes(index)}
            onClick={() => toggleLineSelection(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleLineSelection(index);
              }
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
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
        style={
          {
            backgroundImage: selectedLineRanges
              .map(() => "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))")
              .join(", "),
            backgroundSize: selectedLineRanges
              .map(
                ({ start, end }) =>
                  `100% calc(var(--editor-line-height) * ${end - start + 1})`,
              )
              .join(", "),
            backgroundPosition: selectedLineRanges
              .map(
                ({ start }) =>
                  `0 calc(var(--editor-top-padding) + var(--editor-line-height) * ${start})`,
              )
              .join(", "),
            backgroundRepeat: selectedLineRanges.map(() => "no-repeat").join(", "),
            backgroundAttachment: "local",
          } as CSSProperties
        }
      />
    </div>
  );
}
