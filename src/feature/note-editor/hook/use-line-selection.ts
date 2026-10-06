import { useEffect, useRef } from "react";

import { type NoteTab, useNotepadStore } from "@/src/entity/notepad";

export function useLineSelection(tab: NoteTab) {
  const selectionAnchorByTabRef = useRef(new Map<string, number>());
  const setTabSelectedLines = useNotepadStore((state) => state.setTabSelectedLines);
  const selectedLines = tab.selectedLines;
  const previousTabIdRef = useRef(tab.id);
  const previousContentRef = useRef(tab.content);

  useEffect(() => {
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

        const lineCountDelta = nextLines.length - previousLines.length;
        const unchangedSuffixStart = previousLines.length - commonSuffix;
        const selectionAnchor = selectionAnchorByTabRef.current.get(tab.id);
        if (selectionAnchor !== undefined) {
          const remappedAnchor =
            selectionAnchor < commonPrefix
              ? selectionAnchor
              : selectionAnchor >= unchangedSuffixStart
                ? selectionAnchor + lineCountDelta
                : null;
          if (remappedAnchor === null) {
            selectionAnchorByTabRef.current.delete(tab.id);
          } else {
            selectionAnchorByTabRef.current.set(tab.id, remappedAnchor);
          }
        }

        const remapped = selectedLines.flatMap((lineIndex) => {
          if (lineIndex < commonPrefix) return [lineIndex];
          if (lineIndex >= unchangedSuffixStart)
            return [lineIndex + lineCountDelta];
          return [];
        });
        setTabSelectedLines(tab.id, remapped);
      }
    }
    previousTabIdRef.current = tab.id;
    previousContentRef.current = tab.content;
  }, [tab.content, tab.id, selectedLines, setTabSelectedLines]);

  const toggleLineSelection = (lineIndex: number, extendSelection = false) => {
    if (!extendSelection || !selectionAnchorByTabRef.current.has(tab.id)) {
      selectionAnchorByTabRef.current.set(tab.id, lineIndex);
    }
    const anchor = selectionAnchorByTabRef.current.get(tab.id) ?? lineIndex;

    const next = new Set(selectedLines);

    if (extendSelection && next.has(lineIndex)) {
      let blockStart = lineIndex;
      let blockEnd = lineIndex;
      while (next.has(blockStart - 1)) blockStart -= 1;
      while (next.has(blockEnd + 1)) blockEnd += 1;
      for (let line = blockStart; line <= blockEnd; line += 1) {
        next.delete(line);
      }
    } else {
      const rangeStart = Math.min(anchor, lineIndex);
      const rangeEnd = Math.max(anchor, lineIndex);
      const range = Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, index) => rangeStart + index,
      );
      const rangeIsSelected = range.every((line) => next.has(line));
      for (const line of range) {
        if (rangeIsSelected) next.delete(line);
        else next.add(line);
      }
    }
    setTabSelectedLines(tab.id, [...next].sort((first, second) => first - second));
  };

  return { selectedLines, toggleLineSelection };
}
