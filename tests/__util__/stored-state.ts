import type { Page } from "@playwright/test";

import type { GroupEntry, NotepadState } from "@/src/entity/notepad";

import { STORAGE_KEY } from "../__constant__";

export type StoredState = Pick<NotepadState, "groups" | "activeGroupId" | "nextTabNumber"> &
  Partial<Pick<NotepadState, "closedTabs">>;

// Reads the persisted Zustand state from localStorage.
export const readStoredState = (page: Page): Promise<StoredState> =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state, STORAGE_KEY);

export const readActiveGroup = async (page: Page): Promise<GroupEntry> => {
  const state = await readStoredState(page);
  return state.groups.find((group) => group.id === state.activeGroupId)!;
};

// Persists `state` once and reloads so the app hydrates from it.
export async function writeStoredState(page: Page, state: unknown) {
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify({ state: value, version: 0 }));
      const url = new URL(window.location.href);
      for (const key of ["group", "leftTab", "rightTab", "pane", "panel"]) {
        url.searchParams.delete(key);
      }
      const historyState =
        window.history.state && typeof window.history.state === "object"
          ? { ...window.history.state }
          : {};
      delete historyState.__webNotepadView;
      window.history.replaceState(historyState, "", `${url.pathname}${url.search}${url.hash}`);
    },
    { key: STORAGE_KEY, value: state },
  );
  await page.reload();
}

// Seeds `state` before every page load (including reloads), then opens the app.
export async function seedStoredStateOnLoad(page: Page, state: unknown) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify({ state: value, version: 0 })),
    { key: STORAGE_KEY, value: state },
  );
  await page.goto("/");
}
