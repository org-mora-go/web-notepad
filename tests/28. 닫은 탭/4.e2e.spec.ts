import { expect, test } from "@playwright/test";

import { closedCommand, writeStoredState } from "../__util__";

test("4. 닫을 당시의 그룹이 삭제되었으면 Ungrouped로 표시하고 Ungrouped로 복원한다", async ({ page }) => {
  const createTab = (id: string, content: string) => ({
    id, title: content, content, savedContent: content, selectedLines: [],
    tabColor: "green", pinned: false, bookmarked: false, updatedAt: 1,
  });
  await writeStoredState(page, {
    groups: [{
      id: "ungrouped", name: "Ungrouped", createdAt: 0, tabs: [createTab("tab-1", "")],
      bookmarks: [], activeTabId: "tab-1", rightTabIds: [], activeRightTabId: null,
      activePane: "left", splitRatio: 0.5,
    }],
    activeGroupId: "ungrouped",
    nextTabNumber: 3,
    closedTabs: [{
      id: "closed-1", groupId: "group-deleted", tab: createTab("tab-2", "orphan note"), closedAt: 1,
    }],
  });

  await closedCommand(page).click();
  await expect(page.locator(".closed-item-heading strong")).toHaveText("Ungrouped");
  await page.locator(".closed-item").getByRole("button", { name: "복원" }).click();

  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("orphan note");
});
