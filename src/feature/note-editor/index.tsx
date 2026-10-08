"use client";

import type { RefObject } from "react";

import type { NoteTab } from "@/src/entity/notepad";

import { Editor } from "./component";
import { useNoteEditor } from "./hook";

type Props = {
  tab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  onChange: (content: string) => void;
};

export function NoteEditor({
  tab,
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

  return (
    <Editor
      tab={tab}
      editorRef={editorRef}
      lineRailRef={lineRailRef}
      selectedLines={selectedLines}
      autoFocus={autoFocus}
      onToggleLineSelection={toggleLineSelection}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onScroll={handleScroll}
    />
  );
}
