import { expect, type Page, test } from "@playwright/test";

async function seedSplitState(page: Page) {
  await page.addInitScript(() => {
    const tabs = [
      { id: "left", title: "Left", content: "left", savedContent: "left", urgent: false, pinned: false, bookmarked: false, updatedAt: 1 },
      { id: "right", title: "Right", content: "right", savedContent: "right", urgent: false, pinned: false, bookmarked: false, updatedAt: 2 },
    ];
    localStorage.setItem("web-notepad-storage", JSON.stringify({ state: { activeGroupId: "ungrouped", groups: [{ id: "ungrouped", name: "Ungrouped", createdAt: 0, tabs, bookmarks: [], activeTabId: "left", rightTabIds: ["right"], activeRightTabId: "right", activePane: "left", splitRatio: 0.5 }] }, version: 0 }));
  });
}

test("a. 탭을 좌우 패널로 이동하면 분할 화면에 두 패널이 표시된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  await expect(page.locator(".note-pane-body")).toHaveCount(2);
  await expect(page.locator(".note-pane-body").nth(0).locator("textarea")).toHaveValue("left");
  await expect(page.locator(".note-pane-body").nth(1).locator("textarea")).toHaveValue("right");
});
