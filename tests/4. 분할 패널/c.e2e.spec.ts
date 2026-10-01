import { expect, type Page, test } from "@playwright/test";

async function seedSplitState(page: Page) {
  await page.addInitScript(() => {
    const tabs = [
      {
        id: "left",
        title: "Left",
        content: "left",
        savedContent: "left",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 1,
      },
      {
        id: "right",
        title: "Right",
        content: "right",
        savedContent: "right",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 2,
      },
    ];
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          activeGroupId: "ungrouped",
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              createdAt: 0,
              tabs,
              bookmarks: [],
              activeTabId: "left",
              rightTabIds: ["right"],
              activeRightTabId: "right",
              activePane: "left",
              splitRatio: 0.5,
            },
          ],
        },
        version: 0,
      }),
    );
  });
}

test("c. 오른쪽 패널의 탭을 닫으면 분할 화면이 해제된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  await page.locator(".pane-slot").nth(1).locator(".tab-close").click();
  await expect(page.locator(".note-pane-body")).toHaveCount(1);
});
