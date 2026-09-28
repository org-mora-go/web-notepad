"use client";

import { useRef, type RefObject } from "react";
import type { NoteTab } from "@/src/page/home/store";
import { handleEditorKeyDown, insertAtSelection } from "./util";

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
    const { content: nextContent, cursorPosition } = insertAtSelection(
      content,
      textarea.selectionStart,
      textarea.selectionEnd,
      "\t",
    );
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
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
        onKeyDown={(event) =>
          handleEditorKeyDown(event, {
            tabId: tab.id,
            undoHistoryRef,
            redoHistoryRef,
            contentRef,
            composingRef,
            onChange,
            commitContent,
            insertTab,
          })
        }
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
