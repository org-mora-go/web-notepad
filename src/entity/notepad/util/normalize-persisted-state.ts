import type { NotepadState } from "../type";

export function normalizePersistedState(
  persistedState: unknown,
  currentState: NotepadState,
): NotepadState {
  const persisted = {
    ...(persistedState as Partial<NotepadState> & {
      unsavedSnapshots?: unknown;
      nextUnsavedNumber?: unknown;
    }),
  };
  delete persisted.unsavedSnapshots;
  delete persisted.nextUnsavedNumber;

  const tabs = (Array.isArray(persisted.tabs) ? persisted.tabs : currentState.tabs).map((tab) => ({
    ...tab,
    title: typeof tab.title === "string" ? tab.title : "Untitled",
    content: typeof tab.content === "string" ? tab.content : "",
    savedContent: typeof tab.savedContent === "string" ? tab.savedContent : "",
    urgent: Boolean(tab.urgent),
    pinned: Boolean(tab.pinned),
    bookmarked: Boolean(tab.bookmarked),
  }));
  const bookmarks = Array.isArray(persisted.bookmarks)
    ? persisted.bookmarks
        .filter((bookmark) => bookmark && typeof bookmark.id === "string")
        .map((bookmark) => ({
          ...bookmark,
          sourceTabId: typeof bookmark.sourceTabId === "string" ? bookmark.sourceTabId : "",
          title: typeof bookmark.title === "string" ? bookmark.title : "Untitled",
          content: typeof bookmark.content === "string" ? bookmark.content : "",
          createdAt:
            typeof bookmark.createdAt === "number" && Number.isFinite(bookmark.createdAt)
              ? bookmark.createdAt
              : Date.now(),
        }))
    : currentState.bookmarks;

  return { ...currentState, ...persisted, tabs, bookmarks };
}
