import type { Page } from "@playwright/test";

import { confirmTabDelete } from "./delete-tab-popup";

// Types `content` into the active tab, then closes it through the delete popup.
export async function closeActiveTabWithContent(page: Page, content: string) {
  await page.locator("textarea").fill(content);
  await page.locator(".tab-item.is-active .tab-close").click();
  await confirmTabDelete(page);
}
