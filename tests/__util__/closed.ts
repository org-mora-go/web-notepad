import type { Page } from "@playwright/test";

import { confirmTabDelete } from "./delete-tab-popup";

export const closedContents = (page: Page) =>
  page.locator(".closed-item .expandable-content-text");
export const closedDeletePopup = (page: Page) =>
  page.getByRole("alertdialog", { name: "Delete closed tab" });

export async function closeActiveTab(page: Page) {
  await page.locator(".tab-item.is-active .tab-close").click();
}

// Types `content` into the active tab, then closes it through the delete popup.
export async function closeActiveTabWithContent(page: Page, content: string) {
  await page.locator("textarea").fill(content);
  await closeActiveTab(page);
  await confirmTabDelete(page);
}

// Restores the first closed tab from the open Closed panel.
export async function restoreFirstClosedTab(page: Page) {
  await page.locator(".closed-item").first().getByRole("button", { name: "복원" }).click();
}
