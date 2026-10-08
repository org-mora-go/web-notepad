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

export function isImeComposing(
  event: Pick<KeyboardEvent, "isComposing" | "keyCode">,
  compositionActive: boolean,
) {
  return compositionActive || event.isComposing || event.keyCode === 229;
}
