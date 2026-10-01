import type { Page } from "@playwright/test";

export async function bookmarkActiveTab(page: Page, content: string) {
  await page.locator("textarea").fill(content);
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
}
