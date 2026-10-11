import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../__util__";

test("3. 존재하지 않는 그룹과 탭 선택을 유효한 기본 선택으로 정리한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "missing-group",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        activeTabId: "missing-tab",
        tabs: [{ id: "valid-tab", content: "fallback note" }],
        rightTabIds: ["missing-tab"],
        activeRightTabId: "missing-tab",
        activePane: "right",
      },
    ],
  });
  await expect(page.locator("textarea")).toHaveValue("fallback note");
  await expect(page.locator(".body")).toHaveCount(1);
  const groupName = page.locator(".group-status-command .group-status-name");
  await expect(groupName).toHaveText("Ungrouped");
  await expect(groupName).toBeVisible();
});
