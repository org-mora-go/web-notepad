import type { NoteTab } from "../type";

export const createNoteTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: "-",
  content: "",
  savedContent: "",
  urgent: false,
  pinned: false,
  bookmarked: false,
  updatedAt: 0,
});

export const getNextTabNumber = (
  tabs: NoteTab[],
  reservedIds: string[] = [],
  startAt = 2,
) => {
  const usedIds = new Set([...tabs.map((tab) => tab.id), ...reservedIds]);
  let number = startAt;
  while (usedIds.has(`tab-${number}`)) number += 1;
  return number;
};

export const getTitleFromContent = (content: unknown, fallback: string) => {
  const text = typeof content === "string" ? content : "";
  if (!text.trim()) return "-";

  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine?.slice(0, 28) || fallback;
};
