import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("4. PC와 모바일에서 Escape로 우측 패널을 닫고 메모·그룹·북마크 데이터를 유지한다", async ({ page }) => {
  await page.goto("/");
  const note = "Preserve this note";
  await bookmarkActiveTab(page, note);
  const editor = page.locator("textarea");
  const groupsPanel = page.locator("#groups-panel");
  const bookmarksPanel = page.locator("#bookmarks-panel");
  const shortcutsPanel = page.locator("#shortcuts-panel");

  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);

    await page.locator('button[aria-controls="groups-panel"]').click();
    await expect(groupsPanel).toHaveAttribute("aria-hidden", "false");
    await groupsPanel.getByPlaceholder("Search groups").fill("Ungrouped");
    await expect(groupsPanel.getByPlaceholder("Search groups")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(groupsPanel).toHaveAttribute("aria-hidden", "true");
    await expect(editor).toHaveValue(note);

    await page.locator('button[aria-controls="bookmarks-panel"]').click();
    await expect(bookmarksPanel).toHaveAttribute("aria-hidden", "false");
    await bookmarksPanel.getByPlaceholder("Search bookmarks").fill("Preserve");
    await expect(bookmarksPanel.getByPlaceholder("Search bookmarks")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(bookmarksPanel).toHaveAttribute("aria-hidden", "true");
    await expect(editor).toHaveValue(note);

    if (viewport.width === 1280) {
      await page.getByRole("button", { name: "단축키 안내" }).click();
      await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "false");
      await page.keyboard.press("Escape");
      await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "true");
      await expect(editor).toHaveValue(note);
    }
  }

  const stored = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
    return {
      groups: state.groups.map((group: { name: string }) => group.name),
      content: state.groups[0].tabs[0].content,
      bookmarks: state.groups[0].bookmarks.map((bookmark: { content: string }) => bookmark.content),
    };
  });
  expect(stored).toEqual({ groups: ["Ungrouped"], content: note, bookmarks: [note] });
});
