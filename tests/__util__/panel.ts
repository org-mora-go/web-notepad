import type { Page } from "@playwright/test";

export const groupsCommand = (page: Page) =>
  page.locator('button[aria-controls="groups-panel"]');
export const bookmarksCommand = (page: Page) =>
  page.locator('button[aria-controls="bookmarks-panel"]');
export const shortcutsCommand = (page: Page) =>
  page.locator('button[aria-controls="shortcuts-panel"]');

// Creates a group from the open groups panel.
export async function createGroup(page: Page, name: string) {
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill(name);
  await page.getByRole("button", { name: "그룹 생성" }).click();
}

// Opens the groups panel, creates the groups, and closes the panel again.
export async function createGroups(page: Page, ...names: string[]) {
  await groupsCommand(page).click();
  for (const name of names) await createGroup(page, name);
  await page.getByRole("button", { name: "그룹 닫기" }).click();
}

// Opens the groups panel and selects the group with the exact name.
export async function switchGroup(page: Page, name: string) {
  await groupsCommand(page).click();
  await page.locator(".group-item").getByRole("button", { name, exact: true }).click();
}
