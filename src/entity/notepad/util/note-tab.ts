import type { NoteTab } from "../type";

export const createNoteTab = (number: number): NoteTab => ({
  id: `tab-${number}`,
  title: "-",
  content: "",
  savedContent: "",
  selectedLines: [],
  tabColor: "green",
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

// Keeps unique, in-range line indexes in ascending order.
export const sanitizeSelectedLines = (value: unknown, content: string): number[] => {
  if (!Array.isArray(value)) return [];
  const lineCount = content.split("\n").length;
  return [...new Set(value.filter(
    (line: unknown): line is number =>
      typeof line === "number" && Number.isInteger(line) && line >= 0 && line < lineCount,
  ))].sort((first, second) => first - second);
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
