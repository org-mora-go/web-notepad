// Alt/Option+Backspace without Ctrl/Cmd: the close-tab shortcut.
export const isAltBackspace = (event: Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey" | "key" | "code">) =>
  event.altKey && !event.ctrlKey && !event.metaKey &&
  (event.key === "Backspace" || event.code === "Backspace");
