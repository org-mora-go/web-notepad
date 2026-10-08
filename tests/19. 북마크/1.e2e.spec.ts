import { expect, test } from "@playwright/test";

import {
  bookmarksCommand,
  chooseTabMenuItem,
  cycleActiveTabColor,
  lineButtons,
  readStoredState,
} from "../__util__";

test("1. 북마크에 제목과 내용과 생성 시각 및 탭 색상과 선택한 줄을 저장한다", async ({
  page,
}) => {
  await page.goto("/");
  const content = "bookmark content\nsecond\nthird";
  await page.locator("textarea").fill(content);
  await cycleActiveTabColor(page, 2);
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await chooseTabMenuItem(page, "Bookmark");
  expect((await readStoredState(page)).groups[0].bookmarks[0]).toMatchObject({
    title: "bookmark content",
    content,
    createdAt: expect.any(Number),
    tabColor: "red",
    selectedLines: [1, 2],
  });
  await bookmarksCommand(page).click();
  await expect(page.locator(".bookmark-item")).toContainText(
    "bookmark content",
  );
});
