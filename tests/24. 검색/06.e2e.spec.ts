import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import {
  bookmarksCommand,
  closedCommand,
  groupsCommand,
  seedStoredStateOnLoad,
} from "../__util__";

test("6. 검색 결과에서 일치하는 키워드 부분을 음영으로 강조한다", async ({ page }) => {
  const group = createGroupFixture("work", "Work group", [
    createTabFixture("active-tab", "Current note"),
  ], {
    bookmarks: [{
      id: "bookmark-1",
      sourceTabId: "active-tab",
      title: "Alpha bookmark",
      content: "Read alpha again",
      tabColor: "green",
      selectedLines: [],
      createdAt: 1,
    }],
  });
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 2,
    closedTabs: [
      createClosedTabFixture(
        "closed-1",
        group.id,
        createTabFixture("closed-tab", "Beta note from Work"),
      ),
    ],
  });

  await groupsCommand(page).click();
  await page.getByRole("searchbox", { name: "그룹 검색" }).fill("WORK");
  await expect(page.locator(".group-select mark.search-highlight")).toHaveText("Work");

  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await bookmarksCommand(page).click();
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("ALPHA");
  const bookmarkHighlights = page.locator(".bookmark-item mark.search-highlight");
  await expect(bookmarkHighlights).toHaveText(["Alpha", "alpha"]);
  await expect(bookmarkHighlights.first()).toHaveCSS(
    "background-color",
    "rgba(143, 227, 176, 0.22)",
  );

  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await closedCommand(page).click();
  await page.getByRole("searchbox", { name: "닫은 탭 검색" }).fill("WORK");
  await expect(page.locator(".closed-item-heading mark.search-highlight")).toHaveText("Work");
  await expect(page.locator(".closed-item .expandable-content-text mark.search-highlight")).toHaveText("Work");
  await page.getByRole("searchbox", { name: "닫은 탭 검색" }).fill("BETA");
  await expect(page.locator(".closed-item .expandable-content-text mark.search-highlight")).toHaveText("Beta");
});