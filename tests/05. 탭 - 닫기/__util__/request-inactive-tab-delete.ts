import { expect, type Page } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../../__util__";

// Leaves "Target note" inactive behind "Keep the active note" and opens its delete popup.
export async function requestInactiveTabDelete(page: Page) {
  const editor = page.locator("textarea");
  await editor.fill("Target note");
  await addTabButton(page).click();
  await editor.fill("Keep the active note");
  await page.locator(".tab-item").first().locator(".tab-close").click();
  await expect(deleteTabPopup(page)).toBeVisible();
}
