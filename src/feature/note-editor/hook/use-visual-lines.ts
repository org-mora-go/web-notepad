import { type RefObject, useLayoutEffect, useState } from "react";

export function useVisualLines(
  content: string,
  editorRef: RefObject<HTMLTextAreaElement | null>,
  lineRailRef: RefObject<HTMLDivElement | null>,
) {
  const [visualLines, setVisualLines] = useState<number[]>([0]);

  useLayoutEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const mirror = document.createElement("div");
    mirror.setAttribute("aria-hidden", "true");
    document.body.append(mirror);

    const measure = () => {
      const style = getComputedStyle(textarea);
      Object.assign(mirror.style, {
        position: "fixed",
        top: "0",
        left: "0",
        visibility: "hidden",
        pointerEvents: "none",
        boxSizing: "border-box",
        width: `${textarea.clientWidth}px`,
        padding: style.padding,
        font: style.font,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        tabSize: style.tabSize,
        whiteSpace: style.whiteSpace,
        overflowWrap: style.overflowWrap,
        wordBreak: style.wordBreak,
      });
      const logicalLines = content.split("\n");
      const blocks = logicalLines.map((line) => {
        const block = document.createElement("div");
        block.textContent = line || "\u200b";
        return block;
      });
      mirror.replaceChildren(...blocks);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const nextLines = blocks.flatMap((block, index) =>
        Array.from(
          { length: Math.max(1, Math.round(block.offsetHeight / lineHeight)) },
          () => index,
        ),
      );
      setVisualLines((previous) =>
        previous.length === nextLines.length &&
        previous.every((line, index) => line === nextLines[index])
          ? previous
          : nextLines,
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(textarea);
    measure();
    let active = true;
    void document.fonts.ready.then(() => {
      if (active) measure();
    });
    return () => {
      active = false;
      observer.disconnect();
      mirror.remove();
    };
  }, [content, editorRef]);

  useLayoutEffect(() => {
    if (lineRailRef.current && editorRef.current) {
      lineRailRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, [visualLines, editorRef, lineRailRef]);

  return visualLines;
}