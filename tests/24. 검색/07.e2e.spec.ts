import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { MOBILE_VIEWPORT } from "../__constant__";
import { groupStatusName, seedStoredStateOnLoad } from "../__util__";

test("7. CLOSED 왼쪽의 전체 검색에서 그룹·북마크·닫은 탭을 찾아 이동·열기·복원한다", async ({ page }) => {
  const workGroup = createGroupFixture("work", "Work", [
    createTabFixture("work-tab", "Quarterly goals"),
  ], {
    bookmarks: [{
      id: "work-bookmark",
      sourceTabId: "work-tab",
      title: "Work plan",
      content: "Quarterly goals",
      tabColor: "green",
      selectedLines: [],
      createdAt: 1,
    }],
  });
  const ungrouped = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("current-tab", "Current note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: ungrouped.id,
    groups: [ungrouped, workGroup],
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture(
        "closed-work",
        workGroup.id,
        createTabFixture("closed-tab", "Archived draft"),
      ),
    ],
  });

  const command = page.locator(".global-search-command");
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(command.locator(".global-search-label")).toBeHidden();
  await expect(command.locator("svg")).toBeVisible();
  await command.press("Enter");

  const search = page.getByRole("searchbox", { name: "전체 검색" });
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".global-search-empty-state")).toHaveText("Enter a search term");
  await search.fill("Work");
  await expect(page.locator(".global-search-groups .global-search-result")).toHaveCount(1);
  await expect(page.locator(".global-search-bookmarks .global-search-result")).toHaveCount(1);
  await expect(page.locator(".global-search-closed .global-search-result")).toHaveCount(1);

  await page.getByRole("button", { name: "그룹 Work 선택" }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await command.press("Enter");
  await search.fill("Work plan");
  await page.getByRole("button", { name: "북마크 Work plan 열기" }).click();
  await expect(page.locator("textarea")).toHaveValue("Quarterly goals");

  await command.press("Enter");
  await search.fill("Archived");
  await page.getByRole("button", { name: "닫은 탭 Archived draft 복원" }).click();
  await expect(page.locator("textarea")).toHaveValue("Archived draft");
  await expect(page.locator(".closed-item")).toHaveCount(0);
});