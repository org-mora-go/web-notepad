import type { Locator } from "@playwright/test";

export function countWrappedLines(editor: Locator) {
  return editor.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    const clone = textarea.cloneNode() as HTMLTextAreaElement;
    const style = getComputedStyle(textarea);
    clone.value = textarea.value;
    for (const property of style) {
      clone.style.setProperty(property, style.getPropertyValue(property));
    }
    Object.assign(clone.style, {
      position: "fixed",
      visibility: "hidden",
      width: `${textarea.clientWidth}px`,
      height: "0px",
      minHeight: "0px",
      overflow: "hidden",
    });
    document.body.append(clone);
    const count = Math.round(
      (clone.scrollHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) /
        parseFloat(style.lineHeight),
    );
    clone.remove();
    return count;
  });
}
