import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, DESKTOP_VIEWPORT } from "../__constant__";
import {
  bookmarkActiveTab,
  bookmarksCommand,
  groupsCommand,
  readStoredState,
  shortcutsCommand,
} from "../__util__";

test("4. PC와 모바일에서 Escape로 우측 패널을 닫고 메모·그룹·북마크 데이터를 유지한다", async ({ page }) => {
  await page.goto("/");
  const note = "Preserve this note";
  await bookmarkActiveTab(page, note);
  const editor = page.locator("textarea");
  const groupsPanel = page.locator("#groups-panel");
  const groupSearch = groupsPanel.getByPlaceholder("Search groups");
  const bookmarksPanel = page.locator("#bookmarks-panel");
  const bookmarkSearch = bookmarksPanel.getByPlaceholder("Search bookmarks");
  const shortcutsPanel = page.locator("#shortcuts-panel");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);

    await groupsCommand(page).click();
    await expect(groupsPanel).toHaveAttribute("aria-hidden", "false");
    await groupSearch.fill("Ungrouped");
    await expect(groupSearch).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(groupsPanel).toHaveAttribute("aria-hidden", "true");
    await expect(editor).toHaveValue(note);

    await bookmarksCommand(page).click();
    await expect(bookmarksPanel).toHaveAttribute("aria-hidden", "false");
    await bookmarkSearch.fill("Preserve");
    await expect(bookmarkSearch).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(bookmarksPanel).toHaveAttribute("aria-hidden", "true");
    await expect(editor).toHaveValue(note);

    if (viewport === DESKTOP_VIEWPORT) {
      await shortcutsCommand(page).click();
      await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "false");
      await page.keyboard.press("Escape");
      await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "true");
      await expect(editor).toHaveValue(note);
    }
  }

  const { groups } = await readStoredState(page);
  expect({
    groups: groups.map((group) => group.name),
    content: groups[0].tabs[0].content,
    bookmarks: groups[0].bookmarks.map((bookmark) => bookmark.content),
  }).toEqual({ groups: ["Ungrouped"], content: note, bookmarks: [note] });
});
