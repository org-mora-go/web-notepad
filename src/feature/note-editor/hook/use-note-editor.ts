import type { ChangeEvent, KeyboardEvent, UIEvent } from "react";
import { type RefObject, useEffect, useRef, useState } from "react";

import type { NoteTab } from "@/src/entity/notepad";

import { handleEditorKeyDown, insertAtSelection } from "../util";

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
  const [selectedLinesByTab, setSelectedLinesByTab] = useState<
    Record<string, number[]>
  >({});
  const selectedLines = selectedLinesByTab[tab.id] ?? [];
  const previousTabIdRef = useRef(tab.id);
  const previousContentRef = useRef(tab.content);
  const pendingTabInsertionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    contentRef.current = tab.content;
    if (previousTabIdRef.current === tab.id) {
      const previousLines = previousContentRef.current.split("\n");
      const nextLines = tab.content.split("\n");
      if (nextLines.length !== previousLines.length) {
        const shorterLength = Math.min(previousLines.length, nextLines.length);
        let commonPrefix = 0;
        while (
          commonPrefix < shorterLength &&
          previousLines[commonPrefix] === nextLines[commonPrefix]
        ) {
          commonPrefix += 1;
        }

        let commonSuffix = 0;
        while (
          commonSuffix < shorterLength - commonPrefix &&
          previousLines[previousLines.length - 1 - commonSuffix] ===
            nextLines[nextLines.length - 1 - commonSuffix]
        ) {
          commonSuffix += 1;
        }

        // Positive when lines were inserted (e.g. Enter), negative when removed.
        const lineCountDelta = nextLines.length - previousLines.length;
        const unchangedSuffixStart = previousLines.length - commonSuffix;
        setSelectedLinesByTab((current) => {
          const selected = current[tab.id] ?? [];
          const remapped = selected.flatMap((lineIndex) => {
            if (lineIndex < commonPrefix) return [lineIndex];
            if (lineIndex >= unchangedSuffixStart)
              return [lineIndex + lineCountDelta];
            return [];
          });
          return { ...current, [tab.id]: remapped };
        });
      }
    }
    previousTabIdRef.current = tab.id;
    previousContentRef.current = tab.content;
  }, [tab.content, tab.id]);

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

  const toggleLineSelection = (lineIndex: number) => {
    setSelectedLinesByTab((current) => {
      const selected = current[tab.id] ?? [];
      const next = selected.includes(lineIndex)
        ? selected.filter((selectedIndex) => selectedIndex !== lineIndex)
        : [...selected, lineIndex];
      return { ...current, [tab.id]: next };
    });
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
