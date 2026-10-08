import type {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  RefObject,
  UIEvent,
} from "react";

import type { NoteTab } from "@/src/entity/notepad";

import { useVisualLines } from "../hook/use-visual-lines";

type Props = {
  tab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  lineRailRef: RefObject<HTMLDivElement | null>;
  selectedLines: number[];
  autoFocus: boolean;
  onToggleLineSelection: (lineIndex: number, extendSelection?: boolean) => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onScroll: (event: UIEvent<HTMLTextAreaElement>) => void;
};

export function Editor({
  tab,
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
  const visualLines = useVisualLines(tab.content, editorRef, lineRailRef);
  const selectedLineRanges: { start: number; end: number }[] = [];
  for (const [line, logicalLine] of visualLines.entries()) {
    if (!selectedLines.includes(logicalLine)) continue;
    const lastRange = selectedLineRanges.at(-1);
    if (lastRange && line === lastRange.end + 1) {
      lastRange.end = line;
    } else {
      selectedLineRanges.push({ start: line, end: line });
    }
  }

  return (
    <div
      className={`note-editor ${selectedLines.length > 0 ? "has-selected-line" : ""}`}
      data-tab-color={tab.tabColor}
    >
      <div
        className={`line-rail ${selectedLines.includes(0) ? "has-first-line-selected" : ""}`}
        ref={lineRailRef}
        aria-label="라인 번호"
      >
        {visualLines.map((logicalLine, index) => (
          <span
            key={index}
            className={selectedLines.includes(logicalLine) ? "is-selected" : ""}
            role="button"
            tabIndex={0}
            aria-pressed={selectedLines.includes(logicalLine)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => onToggleLineSelection(logicalLine, event.shiftKey)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggleLineSelection(logicalLine);
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
              .map(
                () =>
                  "linear-gradient(var(--selected-line-background), var(--selected-line-background))",
              )
              .join(", "),
            backgroundSize: selectedLineRanges
              .map(
                ({ start, end }) =>
                  `100% calc(var(--editor-line-height) * ${end - start + 1} + ${start === 0 ? "var(--editor-top-padding)" : "0px"})`,
              )
              .join(", "),
            backgroundPosition: selectedLineRanges
              .map(
                ({ start }) =>
                  `0 ${start === 0 ? "0px" : `calc(var(--editor-top-padding) + var(--editor-line-height) * ${start})`}`,
              )
              .join(", "),
            backgroundRepeat: selectedLineRanges
              .map(() => "no-repeat")
              .join(", "),
            backgroundAttachment: "local",
          } as CSSProperties
        }
      />
    </div>
  );
}
