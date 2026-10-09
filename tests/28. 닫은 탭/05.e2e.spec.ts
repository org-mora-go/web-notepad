import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { groupStatusName, seedStoredStateOnLoad, switchGroup } from "../__util__";

test("5. CLOSED 개수는 현재 선택된 그룹의 닫은 탭만 표시한다", async ({ page }) => {
  const workGroup = createGroupFixture("work", "Work", [createTabFixture("work-tab", "Work note")]);
  const personalGroup = createGroupFixture("personal", "Personal", [
    createTabFixture("personal-tab", "Personal note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: workGroup.id,
    groups: [workGroup, personalGroup],
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture("work-closed-1", workGroup.id, createTabFixture("work-closed-tab-1", "Work archive 1")),
      createClosedTabFixture("work-closed-2", workGroup.id, createTabFixture("work-closed-tab-2", "Work archive 2")),
      createClosedTabFixture("personal-closed", personalGroup.id, createTabFixture("personal-closed-tab", "Personal archive")),
    ],
  });

  const closedCount = page.locator(".closed-command .status-count");
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(closedCount).toHaveText("(2)");

  await switchGroup(page, "Personal");
  await expect(groupStatusName(page)).toHaveText("Personal");
  await expect(closedCount).toHaveText("(1)");
});