import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../__util__";

test("3. 저장 상태 복원 전에는 로딩을 거쳐 복원된 편집 화면을 표시한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        createdAt: 0,
        tabs: [
          {
            id: "tab-restored",
            title: "Restored",
            content: "restored after hydration",
            savedContent: "restored after hydration",
            urgent: false,
            pinned: false,
            bookmarked: false,
            updatedAt: 1,
          },
        ],
        bookmarks: [],
        activeTabId: "tab-restored",
        rightTabIds: [],
        activeRightTabId: null,
        activePane: "left",
        splitRatio: 0.5,
      },
    ],
  });
  await expect(page.locator("textarea")).toHaveValue(
    "restored after hydration",
  );
  await expect(page.locator(".loading-screen")).toHaveCount(0);
});
