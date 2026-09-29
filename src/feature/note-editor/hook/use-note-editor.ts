import { useEffect, useRef, useState, type RefObject } from "react";
import type {
  ChangeEvent,
  KeyboardEvent,
  UIEvent,
} from "react";
import type { NoteTab } from "@/src/entity/notepad/store";
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
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const previousTabIdRef = useRef(tab.id);
  const previousContentRef = useRef(tab.content);
  contentRef.current = tab.content;

  useEffect(() => {
    if (previousTabIdRef.current !== tab.id) {
      setSelectedLines([]);
    } else {
      const previousLines = previousContentRef.current.split("\n");
      const nextLines = tab.content.split("\n");
      if (nextLines.length < previousLines.length) {
        let commonPrefix = 0;
        while (
          commonPrefix < nextLines.length &&
          previousLines[commonPrefix] === nextLines[commonPrefix]
        ) {
          commonPrefix += 1;
        }

        let commonSuffix = 0;
        while (
          commonSuffix < nextLines.length - commonPrefix &&
          previousLines[previousLines.length - 1 - commonSuffix] ===
            nextLines[nextLines.length - 1 - commonSuffix]
        ) {
          commonSuffix += 1;
        }

        const removedLines = previousLines.length - nextLines.length;
        const unchangedSuffixStart = previousLines.length - commonSuffix;
        setSelectedLines((selected) =>
          selected.flatMap((lineIndex) => {
            if (lineIndex < commonPrefix) return [lineIndex];
            if (lineIndex >= unchangedSuffixStart) return [lineIndex - removedLines];
            return [];
          }),
        );
      }
    }
    previousTabIdRef.current = tab.id;
    previousContentRef.current = tab.content;
  }, [tab.content, tab.id]);

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
    });
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = () => {
    composingRef.current = false;
  };

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (lineRailRef.current) {
      lineRailRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const toggleLineSelection = (lineIndex: number) => {
    setSelectedLines((current) =>
      current.includes(lineIndex)
        ? current.filter((selectedIndex) => selectedIndex !== lineIndex)
        : [...current, lineIndex],
    );
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
