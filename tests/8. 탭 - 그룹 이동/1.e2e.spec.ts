import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import {
  activeTabItem,
  bookmarksCommand,
  expectSelectedLines,
  readStoredState,
  seedMoveGroupState,
  switchGroup,
} from "../__util__";
import { moveTabToTarget } from "./__util__";

test("1. 그룹 이동 시 탭 ID, 내용, 색상, 고정, 줄 선택과 연결 북마크를 유지한다", async ({ page }) => {
  const editor = page.locator("textarea");
  const movedTabItem = activeTabItem(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const original = await seedMoveGroupState(page);
    await moveTabToTarget(page, viewport);

    const moved = await readStoredState(page);
    expect(moved.groups[0].bookmarks).toEqual([]);
    expect(moved.groups[1].tabs.at(-1)).toEqual(original.groups[0].tabs[0]);
    expect(moved.groups[1].bookmarks).toEqual(original.groups[0].bookmarks);

    await switchGroup(page, "Target");
    await expect(editor).toHaveValue("Move me\nselected line");
    await expect(movedTabItem).toHaveClass(/is-pinned/);
    await expect(movedTabItem).toHaveClass(/is-bookmarked/);
    await expect(movedTabItem).toHaveAttribute("data-tab-color", "red");
    await expectSelectedLines(page, [false, true]);
    await bookmarksCommand(page).click();
    await expect(page.locator("#bookmarks-panel strong")).toHaveText("Move me");
    await page.getByRole("button", { name: "열기", exact: true }).click();
    await expect(page.getByRole("tab")).toHaveCount(2);
    await expect(editor).toHaveValue("Move me\nselected line");
  }
});
