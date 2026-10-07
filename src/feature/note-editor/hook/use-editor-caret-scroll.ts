import type { RefObject } from "react";

export function useEditorCaretScroll(
  lineRailRef: RefObject<HTMLDivElement | null>,
) {
  return (textarea: HTMLTextAreaElement) => {
    window.requestAnimationFrame(() => {
      if (!textarea.isConnected) return;

      const style = window.getComputedStyle(textarea);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const paddingTop = Number.parseFloat(style.paddingTop);
      const paddingBottom = Number.parseFloat(style.paddingBottom);
      if (![lineHeight, paddingTop, paddingBottom].every(Number.isFinite)) return;

      const caretLine = textarea.value
        .slice(0, textarea.selectionStart)
        .split("\n").length - 1;
      const caretTop = paddingTop + caretLine * lineHeight;
      const caretBottom = caretTop + lineHeight;
      const visibleTop = textarea.scrollTop + paddingTop;
      const visibleBottom =
        textarea.scrollTop + textarea.clientHeight - paddingBottom;

      let nextScrollTop = textarea.scrollTop;
      if (caretBottom > visibleBottom) {
        nextScrollTop = caretBottom - textarea.clientHeight + paddingBottom;
      } else if (caretTop < visibleTop) {
        nextScrollTop = caretTop - paddingTop;
      }

      nextScrollTop = Math.max(
        0,
        Math.min(nextScrollTop, textarea.scrollHeight - textarea.clientHeight),
      );
      if (nextScrollTop === textarea.scrollTop) return;

      textarea.scrollTop = nextScrollTop;
      if (lineRailRef.current) lineRailRef.current.scrollTop = nextScrollTop;
    });
  };
}
