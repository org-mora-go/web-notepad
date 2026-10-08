import { expect, test } from "@playwright/test";

import {
  bookmarkActiveTab,
  bookmarksCommand,
  cycleActiveTabColor,
  expectSelectedLines,
  lineButtons,
  readStoredState,
} from "../__util__";

test("2. 원본 탭의 내용과 색상 및 줄 선택 변경을 북마크에 반영한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "original\nsecond\nthird");
  const editor = page.locator("textarea");
  await editor.fill("updated\nsecond\nthird");
  await cycleActiveTabColor(page);
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await lines.nth(1).click();
  await editor.fill("prefix\nupdated\nsecond\nthird");
  await expectSelectedLines(page, [false, false, false, true]);
  await expect.poll(async () => {
    const { title, content, tabColor, selectedLines } =
      (await readStoredState(page)).groups[0].bookmarks[0];
    return { title, content, tabColor, selectedLines };
  }).toEqual({
    title: "prefix",
    content: "prefix\nupdated\nsecond\nthird",
    tabColor: "gray",
    selectedLines: [3],
  });
  await bookmarksCommand(page).click();
  await expect(page.locator(".bookmark-item")).toContainText("updated");
});
