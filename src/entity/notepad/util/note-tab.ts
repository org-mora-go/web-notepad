import type { NoteTab } from "../type";

export const createNoteTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: `Untitled ${number}`,
  content: "",
  savedContent: "",
  urgent: false,
  pinned: false,
  bookmarked: false,
  updatedAt: 0,
});

export const getNextTabNumber = (tabs: NoteTab[], nextTabNumber: number) => {
  const usedIds = new Set(tabs.map((tab) => tab.id));
  let number = Math.max(nextTabNumber, 2);
  while (usedIds.has(`tab-${number}`)) number += 1;
  return number;
};

export const sortPinnedFirst = (tabs: NoteTab[]) =>
  tabs
    .map((tab, index) => ({ tab, index }))
    .sort(
      (a, b) => Number(Boolean(b.tab.pinned)) - Number(Boolean(a.tab.pinned)) || a.index - b.index,
    )
    .map(({ tab }) => tab);

export const getTitleFromContent = (content: unknown, fallback: string) => {
  const text = typeof content === "string" ? content : "";
  if (!text.trim()) return "Untitled";

  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine?.slice(0, 28) || fallback;
};
