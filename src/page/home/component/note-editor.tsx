"use client";

import { useRef, type RefObject } from "react";
import type { NoteTab } from "@/src/page/home/store";

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
  const undoHistoryRef = useRef(new Map<string, string[]>());
  const redoHistoryRef = useRef(new Map<string, string[]>());
  const contentRef = useRef(tab.content);
  contentRef.current = tab.content;

  const commitContent = (content: string) => {
    const previousContent = contentRef.current;
    if (content === previousContent) return;

    const history = undoHistoryRef.current.get(tab.id) ?? [];
    undoHistoryRef.current.set(tab.id, [...history.slice(-99), previousContent]);
    redoHistoryRef.current.delete(tab.id);
    contentRef.current = content;
    onChange(content);
  };

  const insertTab = (textarea: HTMLTextAreaElement) => {
    const content = textarea.value;
    commitContent(content);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextContent = `${content.slice(0, start)}\t${content.slice(end)}`;
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(start + 1, start + 1);
    });
  };

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
        onChange={(event) => commitContent(event.target.value)}
        onKeyDown={(event) => {
          const isUndo =
            (event.metaKey || event.ctrlKey) &&
            !event.altKey &&
            !event.shiftKey &&
            event.key.toLowerCase() === "z";
          const isRedo =
            (event.metaKey || event.ctrlKey) &&
            !event.altKey &&
            ((event.shiftKey && event.key.toLowerCase() === "z") ||
              (!event.shiftKey && event.key.toLowerCase() === "y"));

          if (isUndo) {
            const history = undoHistoryRef.current.get(tab.id) ?? [];
            const previousContent = history.at(-1);
            if (previousContent === undefined) return;

            event.preventDefault();
            undoHistoryRef.current.set(tab.id, history.slice(0, -1));
            const redoHistory = redoHistoryRef.current.get(tab.id) ?? [];
            redoHistoryRef.current.set(tab.id, [...redoHistory, contentRef.current]);
            contentRef.current = previousContent;
            onChange(previousContent);
            return;
          }

          if (isRedo) {
            const redoHistory = redoHistoryRef.current.get(tab.id) ?? [];
            const nextContent = redoHistory.at(-1);
            if (nextContent === undefined) return;

            event.preventDefault();
            redoHistoryRef.current.set(tab.id, redoHistory.slice(0, -1));
            const history = undoHistoryRef.current.get(tab.id) ?? [];
            undoHistoryRef.current.set(tab.id, [...history, contentRef.current]);
            contentRef.current = nextContent;
            onChange(nextContent);
            return;
          }

          const nativeEvent = event.nativeEvent;
          const isComposing =
            composingRef.current || nativeEvent.isComposing || nativeEvent.keyCode === 229;

          if (event.key === "Enter" && !isComposing) {
            event.preventDefault();
            const textarea = event.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const content = textarea.value;
            const lineStart = content.lastIndexOf("\n", start - 1) + 1;
            const indentation = content.slice(lineStart, start).match(/^[\t ]*/)?.[0] ?? "";
            const nextContent = `${content.slice(0, start)}\n${indentation}${content.slice(end)}`;
            commitContent(nextContent);

            window.requestAnimationFrame(() => {
              const cursorPosition = start + 1 + indentation.length;
              textarea.setSelectionRange(cursorPosition, cursorPosition);
            });
            return;
          }

          if (event.key !== "Tab") return;

          event.preventDefault();
          const textarea = event.currentTarget;
          window.requestAnimationFrame(() => insertTab(textarea));
        }}
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
