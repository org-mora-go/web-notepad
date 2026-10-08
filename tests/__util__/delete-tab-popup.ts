import type { Page } from "@playwright/test";

export const deleteTabPopup = (page: Page) =>
  page.getByRole("alertdialog", { name: "Delete tab" });

// Confirms the open tab delete popup with its exact "Delete" button.
export async function confirmTabDelete(page: Page) {
  await deleteTabPopup(page).getByRole("button", { name: "Delete", exact: true }).click();
}
