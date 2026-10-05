import { useEffect, useRef, useState } from "react";

import type { NoteTab } from "@/src/entity/notepad";

export function useLineSelection(tab: NoteTab) {
  const selectionAnchorByTabRef = useRef(new Map<string, number>());
  const [selectedLinesByTab, setSelectedLinesByTab] = useState<
    Record<string, number[]>
  >({});
  const selectedLines = selectedLinesByTab[tab.id] ?? [];
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

  const toggleLineSelection = (lineIndex: number, extendSelection = false) => {
    if (!extendSelection || !selectionAnchorByTabRef.current.has(tab.id)) {
      selectionAnchorByTabRef.current.set(tab.id, lineIndex);
    }
    const anchor = selectionAnchorByTabRef.current.get(tab.id) ?? lineIndex;

    setSelectedLinesByTab((current) => {
      const selected = current[tab.id] ?? [];
      const next = new Set(selected);

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
      return {
        ...current,
        [tab.id]: [...next].sort((first, second) => first - second),
      };
    });
  };

  return { selectedLines, toggleLineSelection };
}
