import { expect, test } from "@playwright/test";

import { expectSelectedLines, readStoredState, seedStoredStateOnLoad } from "../__util__";

test("6. 저장된 선택 줄의 중복·범위 초과·잘못된 인덱스를 제거하고 정렬해 복원한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: [{
        id: "tab-1",
        content: "one\ntwo\nthree",
        selectedLines: [2, 1, 1, -1, 3, 0.5, "0", null],
      }],
    }],
  });
  await expectSelectedLines(page, [false, true, true]);
  await page.locator('[role="tab"]').click();
  expect((await readStoredState(page)).groups[0].tabs[0].selectedLines).toEqual([1, 2]);
});
