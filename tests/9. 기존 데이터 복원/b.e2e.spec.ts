import { expect, test } from "@playwright/test";

test("b. 그룹 구조 도입 전 최상위 탭과 북마크를 Ungrouped로 옮겨 복원한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          tabs: [
            {
              id: "legacy-tab",
              title: "Legacy",
              content: "legacy content",
              savedContent: "legacy content",
              urgent: false,
              pinned: false,
              bookmarked: true,
              updatedAt: 1,
            },
          ],
          activeTabId: "legacy-tab",
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
          splitRatio: 0.5,
          bookmarks: [
            {
              id: "legacy-bookmark",
              sourceTabId: "legacy-tab",
              title: "Legacy",
              content: "legacy content",
              createdAt: 1,
            },
          ],
          groups: [{ id: "legacy-group", name: "Legacy", createdAt: 1 }],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");
  await expect(page.locator("textarea")).toHaveValue("legacy content");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-item")).toContainText("legacy content");
});
