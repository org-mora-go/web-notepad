import type { Page } from "@playwright/test";

type BookmarkMetadata = {
  tabColor?: string;
  selectedLines?: unknown[];
};

export async function restoreStoredBookmark(page: Page, metadata: BookmarkMetadata) {
  await page.addInitScript(({ tabColor, selectedLines }) => {
    localStorage.setItem("web-notepad-storage", JSON.stringify({
      state: {
        activeGroupId: "ungrouped",
        groups: [{
          id: "ungrouped",
          name: "Ungrouped",
          tabs: [{ id: "tab-1", content: "" }],
          bookmarks: [{
            id: "old-bookmark",
            sourceTabId: "closed-note",
            title: "Old bookmark",
            content: "one\ntwo\nthree",
            tabColor,
            selectedLines,
            createdAt: 1,
          }],
        }],
      },
      version: 0,
    }));
  }, metadata);
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "열기" }).click();
}