import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { insertIndentedNewline, isImeComposing } from "./editor-content";

type MutableRef<T> = { current: T };

type Options = {
  tabId: string;
  undoHistoryRef: MutableRef<Map<string, string[]>>;
  redoHistoryRef: MutableRef<Map<string, string[]>>;
  contentRef: MutableRef<string>;
  composingRef: MutableRef<boolean>;
  onChange: (content: string) => void;
  commitContent: (content: string) => void;
  insertTab: (textarea: HTMLTextAreaElement) => void;
};

export function handleEditorKeyDown(
  event: ReactKeyboardEvent<HTMLTextAreaElement>,
  {
    tabId,
    undoHistoryRef,
    redoHistoryRef,
    contentRef,
    composingRef,
    onChange,
    commitContent,
    insertTab,
  }: Options,
) {
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
    const history = undoHistoryRef.current.get(tabId) ?? [];
    const previousContent = history.at(-1);
    if (previousContent === undefined) return;

    event.preventDefault();
    undoHistoryRef.current.set(tabId, history.slice(0, -1));
    const redoHistory = redoHistoryRef.current.get(tabId) ?? [];
    redoHistoryRef.current.set(tabId, [...redoHistory, contentRef.current]);
    contentRef.current = previousContent;
    onChange(previousContent);
    return;
  }

  if (isRedo) {
    const redoHistory = redoHistoryRef.current.get(tabId) ?? [];
    const nextContent = redoHistory.at(-1);
    if (nextContent === undefined) return;

    event.preventDefault();
    redoHistoryRef.current.set(tabId, redoHistory.slice(0, -1));
    const history = undoHistoryRef.current.get(tabId) ?? [];
    undoHistoryRef.current.set(tabId, [...history, contentRef.current]);
    contentRef.current = nextContent;
    onChange(nextContent);
    return;
  }

  if (event.key === "Enter" && !isImeComposing(event.nativeEvent, composingRef.current)) {
    event.preventDefault();
    const textarea = event.currentTarget;
    const { content: nextContent, cursorPosition } = insertIndentedNewline(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    commitContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
    return;
  }

  // Option+Tab creates a note tab in the workspace shortcut handler.
  // Do not queue the regular Tab insertion: its animation-frame callback can
  // run after the active tab changes and read the new tab's textarea value.
  if (event.key !== "Tab" || event.altKey) return;

  event.preventDefault();
  const textarea = event.currentTarget;
  window.requestAnimationFrame(() => insertTab(textarea));
}
