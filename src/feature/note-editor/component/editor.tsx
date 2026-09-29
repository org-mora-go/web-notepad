import type {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  RefObject,
  UIEvent,
} from "react";

import type { NoteTab } from "@/src/entity/notepad";

type Props = {
  tab: NoteTab;
  lineCount: number;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  lineRailRef: RefObject<HTMLDivElement | null>;
  selectedLines: number[];
  autoFocus: boolean;
  onToggleLineSelection: (lineIndex: number) => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onScroll: (event: UIEvent<HTMLTextAreaElement>) => void;
};

export function Editor({
  tab,
  lineCount,
  editorRef,
  lineRailRef,
  selectedLines,
  autoFocus,
  onToggleLineSelection,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onScroll,
}: Props) {
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
            onClick={() => onToggleLineSelection(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggleLineSelection(index);
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
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onScroll={onScroll}
        placeholder="Take a note.."
        autoFocus={autoFocus}
        spellCheck={false}
        aria-label={`${tab.title} 메모 내용`}
        style={
          {
            backgroundImage: selectedLineRanges
              .map(() => "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))")
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
