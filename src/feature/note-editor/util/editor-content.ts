export function insertAtSelection(
  content: string,
  start: number,
  end: number,
  insertedText: string,
) {
  return {
    content: content.slice(0, start) + insertedText + content.slice(end),
    cursorPosition: start + insertedText.length,
  };
}

export function insertIndentedNewline(content: string, start: number, end: number) {
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;
  const indentation = content.slice(lineStart, start).match(/^[\t ]*/)?.[0] ?? "";
  const result = insertAtSelection(content, start, end, `\n${indentation}`);

  return { ...result, indentation };
}

export function isImeComposing(
  event: Pick<KeyboardEvent, "isComposing" | "keyCode">,
  compositionActive: boolean,
) {
  return compositionActive || event.isComposing || event.keyCode === 229;
}
