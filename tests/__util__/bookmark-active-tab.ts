import type { Page } from "@playwright/test";

import { chooseTabMenuItem } from "./tab";

export async function bookmarkActiveTab(page: Page, content: string) {
  await page.locator("textarea").fill(content);
  await chooseTabMenuItem(page, "Bookmark");
}
