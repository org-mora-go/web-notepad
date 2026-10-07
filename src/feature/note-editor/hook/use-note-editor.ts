import type { ChangeEvent, KeyboardEvent, UIEvent } from "react";
import { type RefObject, useEffect, useRef } from "react";

import type { NoteTab } from "@/src/entity/notepad";

import { handleEditorKeyDown, insertAtSelection } from "../util";
import { useEditorCaretScroll } from "./use-editor-caret-scroll";
import { useLineSelection } from "./use-line-selection";

type Options = {
  tab: NoteTab;
  composingRef: RefObject<boolean>;
  onChange: (content: string) => void;
};

export function useNoteEditor({ tab, composingRef, onChange }: Options) {
  const lineRailRef = useRef<HTMLDivElement>(null);
  const undoHistoryRef = useRef(new Map<string, string[]>());
  const redoHistoryRef = useRef(new Map<string, string[]>());
  const contentRef = useRef(tab.content);
  const pendingTabInsertionRef = useRef<HTMLTextAreaElement | null>(null);
  const followCaretOnEnter = useEditorCaretScroll(lineRailRef);
  const { selectedLines, toggleLineSelection } = useLineSelection(tab);

  useEffect(() => {
    contentRef.current = tab.content;
  }, [tab.content]);

  const commitContent = (content: string) => {
    const previousContent = contentRef.current;
    if (content === previousContent) return;

    const history = undoHistoryRef.current.get(tab.id) ?? [];
    undoHistoryRef.current.set(tab.id, [
      ...history.slice(-99),
      previousContent,
    ]);
    redoHistoryRef.current.delete(tab.id);
    contentRef.current = content;
    onChange(content);
  };

  const insertTab = (textarea: HTMLTextAreaElement) => {
    const content = textarea.value;
    const { selectionStart, selectionEnd } = textarea;
    commitContent(content);
    const { content: nextContent, cursorPosition } = insertAtSelection(
      content,
      selectionStart,
      selectionEnd,
      "\t",
    );
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    commitContent(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const shouldFollowEnter =
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      !composingRef.current;
    const textarea = event.currentTarget;

    handleEditorKeyDown(event, {
      tabId: tab.id,
      undoHistoryRef,
      redoHistoryRef,
      contentRef,
      composingRef,
      onChange,
      commitContent,
      insertTab,
      hasPendingTabInsertion: () => pendingTabInsertionRef.current !== null,
      queueTabInsertion: (textarea) => {
        pendingTabInsertionRef.current = textarea;
      },
    });

    if (shouldFollowEnter) followCaretOnEnter(textarea);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = () => {
    composingRef.current = false;
    const pendingTextarea = pendingTabInsertionRef.current;
    if (!pendingTextarea) return;

    window.requestAnimationFrame(() => {
      if (pendingTabInsertionRef.current !== pendingTextarea) return;
      pendingTabInsertionRef.current = null;
      insertTab(pendingTextarea);
    });
  };

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (lineRailRef.current) {
      lineRailRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  return {
    lineRailRef,
    selectedLines,
    toggleLineSelection,
    handleChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleScroll,
  };
}
